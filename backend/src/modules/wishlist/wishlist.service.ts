import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async add(userId: string, addToWishlistDto: AddToWishlistDto) {
    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: addToWishlistDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se já está na wishlist
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: addToWishlistDto.productId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Produto já está na lista de desejos');
    }

    const wishlistItem = await this.prisma.wishlist.create({
      data: {
        userId,
        productId: addToWishlistDto.productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            finalPrice: true,
            discountPercent: true,
            images: {
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    });

    return wishlistItem;
  }

  async remove(userId: string, productId: string) {
    const wishlistItem = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Produto não está na lista de desejos');
    }

    await this.prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });

    return { message: 'Produto removido da lista de desejos' };
  }

  async toggle(userId: string, productId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await this.prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return { added: false, message: 'Produto removido da lista de desejos' };
    }

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    return { added: true, message: 'Produto adicionado à lista de desejos' };
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.wishlist.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              finalPrice: true,
              discountPercent: true,
              stock: true,
              isActive: true,
              images: {
                take: 1,
                select: { url: true },
              },
              brand: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wishlist.count({ where: { userId } }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async check(userId: string, productId: string) {
    const item = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { inWishlist: !!item };
  }

  async checkMany(userId: string, productIds: string[]) {
    const items = await this.prisma.wishlist.findMany({
      where: {
        userId,
        productId: { in: productIds },
      },
      select: { productId: true },
    });

    const wishlistSet = new Set(items.map((item) => item.productId));

    return productIds.reduce((acc, id) => {
      acc[id] = wishlistSet.has(id);
      return acc;
    }, {} as Record<string, boolean>);
  }

  async getCount(userId: string) {
    const count = await this.prisma.wishlist.count({
      where: { userId },
    });
    return { count };
  }

  async clear(userId: string) {
    await this.prisma.wishlist.deleteMany({
      where: { userId },
    });
    return { message: 'Lista de desejos limpa' };
  }
}
