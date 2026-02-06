import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    // Verificar se o código já existe
    const existing = await this.prisma.coupon.findUnique({
      where: { code: createCouponDto.code.toUpperCase() },
    });

    if (existing) {
      throw new ConflictException('Já existe um cupom com este código');
    }

    return this.prisma.coupon.create({
      data: {
        ...createCouponDto,
        code: createCouponDto.code.toUpperCase(),
        startsAt: createCouponDto.startsAt ? new Date(createCouponDto.startsAt) : undefined,
        expiresAt: createCouponDto.expiresAt ? new Date(createCouponDto.expiresAt) : undefined,
      },
    });
  }

  async findAll(page = 1, limit = 20, isActive?: boolean) {
    const skip = (page - 1) * limit;
    const where = isActive !== undefined ? { isActive } : {};

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      data: coupons,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    return coupon;
  }

  async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    return coupon;
  }

  async validate(validateCouponDto: ValidateCouponDto) {
    const { code, cartTotal } = validateCouponDto;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    // Verificar se está ativo
    if (!coupon.isActive) {
      throw new BadRequestException('Este cupom não está mais ativo');
    }

    // Verificar data de início
    if (coupon.startsAt && new Date() < coupon.startsAt) {
      throw new BadRequestException('Este cupom ainda não está válido');
    }

    // Verificar expiração
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new BadRequestException('Este cupom expirou');
    }

    // Verificar limite de uso
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Este cupom atingiu o limite de usos');
    }

    // Verificar valor mínimo do pedido
    const minOrderValue = coupon.minOrderValue ? Number(coupon.minOrderValue) : 0;
    if (cartTotal < minOrderValue) {
      throw new BadRequestException(
        `O valor mínimo do pedido para usar este cupom é R$ ${minOrderValue.toFixed(2)}`
      );
    }

    // Calcular desconto
    let discount: number;
    const discountValue = Number(coupon.discountValue);

    if (coupon.discountType === 'PERCENTAGE') {
      discount = (cartTotal * discountValue) / 100;
      
      // Aplicar limite máximo de desconto se existir
      const maxDiscount = coupon.maxDiscount ? Number(coupon.maxDiscount) : null;
      if (maxDiscount && discount > maxDiscount) {
        discount = maxDiscount;
      }
    } else {
      // Desconto fixo
      discount = discountValue;
      
      // Garantir que o desconto não seja maior que o total
      if (discount > cartTotal) {
        discount = cartTotal;
      }
    }

    const finalTotal = cartTotal - discount;

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: discountValue,
      },
      discount: Math.round(discount * 100) / 100,
      originalTotal: cartTotal,
      finalTotal: Math.round(finalTotal * 100) / 100,
    };
  }

  async applyCoupon(code: string) {
    // Incrementar contador de uso
    const coupon = await this.prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: {
        usageCount: { increment: 1 },
      },
    });

    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    // Se estiver atualizando o código, verificar duplicidade
    if (updateCouponDto.code && updateCouponDto.code.toUpperCase() !== coupon.code) {
      const existing = await this.prisma.coupon.findUnique({
        where: { code: updateCouponDto.code.toUpperCase() },
      });

      if (existing) {
        throw new ConflictException('Já existe um cupom com este código');
      }
    }

    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...updateCouponDto,
        code: updateCouponDto.code?.toUpperCase(),
        startsAt: updateCouponDto.startsAt ? new Date(updateCouponDto.startsAt) : undefined,
        expiresAt: updateCouponDto.expiresAt ? new Date(updateCouponDto.expiresAt) : undefined,
      },
    });
  }

  async delete(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    await this.prisma.coupon.delete({ where: { id } });

    return { message: 'Cupom excluído com sucesso' };
  }

  async toggleActive(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    return this.prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });
  }
}
