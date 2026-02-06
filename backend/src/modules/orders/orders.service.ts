import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: OrderQueryDto) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    where: { isMain: true },
                    take: 1,
                  },
                },
              },
            },
          },
          address: true,
          payment: {
            select: { id: true, method: true, status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  where: { isMain: true },
                  take: 1,
                },
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  where: { isMain: true },
                  take: 1,
                },
              },
            },
          },
        },
        payment: {
          select: { id: true, method: true, status: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { addressId, items, shippingMethod, notes } = createOrderDto;

    // Verify address belongs to user
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new BadRequestException('Endereço inválido');
    }

    // Get products and calculate totals
    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== items.length) {
      throw new BadRequestException('Um ou mais produtos não estão disponíveis');
    }

    // Verify stock and calculate subtotal
    let subtotal = 0;
    const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      
      if (!product) {
        throw new BadRequestException(`Produto ${item.productId} não encontrado`);
      }

      if (product.trackStock && product.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para ${product.name}`);
      }

      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: item.productId,
        variantInfo: item.variantInfo,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    // Calculate shipping (simplified)
    const shippingCost = subtotal >= 500 ? 0 : 29.90;
    const total = subtotal + shippingCost;

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order with transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Update stock
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (product?.trackStock) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Create order
      return tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          status: OrderStatus.PENDING,
          subtotal,
          shippingCost,
          total,
          shippingMethod,
          notes,
          items: {
            createMany: {
              data: orderItems,
            },
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
          address: true,
        },
      });
    });

    return order;
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const data: Prisma.OrderUpdateInput = {
      status: updateStatusDto.status,
      ...(updateStatusDto.trackingCode && { trackingCode: updateStatusDto.trackingCode }),
    };

    // Set timestamps based on status
    if (updateStatusDto.status === OrderStatus.PAID) {
      data.paidAt = new Date();
    } else if (updateStatusDto.status === OrderStatus.SHIPPED) {
      data.shippedAt = new Date();
    } else if (updateStatusDto.status === OrderStatus.DELIVERED) {
      data.deliveredAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async cancel(id: string, userId?: string) {
    const where: Prisma.OrderWhereUniqueInput = { id };
    
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        ...(userId && { userId }),
      },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Apenas pedidos pendentes podem ser cancelados');
    }

    // Restore stock
    await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      await tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });
    });

    return { message: 'Pedido cancelado com sucesso' };
  }

  async getStats() {
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      revenue,
      monthlyOrders,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.PAID } }),
      this.prisma.order.aggregate({
        where: { status: { in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] } },
        _sum: { total: true },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
      }),
    ]);

    const totalRevenue = Number(revenue._sum.total || 0);
    const avgTicket = paidOrders > 0 ? totalRevenue / paidOrders : 0;

    return {
      totalOrders,
      pendingOrders,
      paidOrders,
      totalRevenue,
      avgTicket,
      monthlyOrders,
    };
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `USS${timestamp}${random}`;
  }
}
