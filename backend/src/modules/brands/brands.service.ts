import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };

    return this.prisma.brand.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          take: 8,
          include: {
            images: {
              where: { isMain: true },
              take: 1,
            },
            category: {
              select: { name: true, slug: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Marca não encontrada');
    }

    return brand;
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Marca não encontrada');
    }

    return brand;
  }

  async create(createBrandDto: CreateBrandDto) {
    const existingBrand = await this.prisma.brand.findFirst({
      where: {
        OR: [
          { name: createBrandDto.name },
          { slug: createBrandDto.slug },
        ],
      },
    });

    if (existingBrand) {
      throw new ConflictException('Já existe uma marca com este nome ou slug');
    }

    return this.prisma.brand.create({
      data: createBrandDto,
    });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Marca não encontrada');
    }

    if (updateBrandDto.slug && updateBrandDto.slug !== brand.slug) {
      const existingBrand = await this.prisma.brand.findUnique({
        where: { slug: updateBrandDto.slug },
      });

      if (existingBrand) {
        throw new ConflictException('Já existe uma marca com este slug');
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  async delete(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!brand) {
      throw new NotFoundException('Marca não encontrada');
    }

    if (brand._count.products > 0) {
      throw new ConflictException('Não é possível remover marca com produtos associados');
    }

    await this.prisma.brand.delete({
      where: { id },
    });

    return { message: 'Marca removida com sucesso' };
  }
}
