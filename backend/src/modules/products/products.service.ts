import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      isActive = true,
      isFeatured,
      isNew,
      sortBy: sortByParam = 'createdAt',
      orderBy: orderByParam,
      sortOrder = 'desc',
    } = query;

    // orderBy é um alias para sortBy
    const sortBy = orderByParam || sortByParam;

    const skip = (page - 1) * limit;

    // Build price filter
    let priceFilter: any = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;

    const where: Prisma.ProductWhereInput = {
      isActive,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(brandId && { brandId }),
      ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isNew !== undefined && { isNew }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, slug: true, logo: true },
          },
          images: {
            orderBy: { position: 'asc' },
            take: 1,
          },
          _count: {
            select: { variants: true, colors: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { position: 'asc' },
        },
        variants: true,
        colors: true,
        attributes: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { position: 'asc' },
        },
        variants: true,
        colors: true,
        attributes: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async findRelated(productId: string, limit = 4) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, brandId: true },
    });

    if (!product) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        id: { not: productId },
        isActive: true,
        OR: [
          { categoryId: product.categoryId },
          { brandId: product.brandId },
        ],
      },
      take: limit,
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
        brand: {
          select: { name: true, slug: true },
        },
      },
    });
  }

  async getFeatured(limit = 8) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: limit,
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        brand: {
          select: { name: true, slug: true, logo: true },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNew(limit = 8) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isNew: true,
      },
      take: limit,
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        brand: {
          select: { name: true, slug: true, logo: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBestSellers(limit = 8) {
    const bestSellers = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const productIds = bestSellers.map((item) => item.productId);

    return this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        brand: {
          select: { name: true, slug: true, logo: true },
        },
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new ConflictException('Já existe um produto com este slug');
    }

    // Verificar SKU único se fornecido
    if (createProductDto.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: createProductDto.sku },
      });
      if (existingSku) {
        throw new ConflictException('Já existe um produto com este SKU');
      }
    }

    const { images, variants, colors, ...productData } = createProductDto;

    // Calcular estoque total se tiver variações
    let totalStock = productData.stock || 0;
    if (productData.hasVariations && variants && variants.length > 0) {
      totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        stock: totalStock,
        images: images ? { create: images } : undefined,
        variants: variants ? { 
          create: variants.map(v => ({
            name: v.name,
            sku: v.sku,
            ncm: v.ncm,
            options: v.options || {},
            price: v.price,
            comparePrice: v.comparePrice,
            costPrice: v.costPrice,
            priceAdjustment: v.priceAdjustment,
            stock: v.stock || 0,
            image: v.image,
            serialNumbers: v.serialNumbers || [],
            isActive: v.isActive !== false,
          }))
        } : undefined,
        colors: colors ? {
          create: colors.map(c => ({
            name: c.name,
            hexCode: c.hexCode,
            images: c.images || [],
            stock: c.stock || 0,
            priceModifier: c.priceModifier,
            isDefault: c.isDefault || false,
          }))
        } : undefined,
      },
      include: {
        category: true,
        brand: true,
        images: true,
        variants: true,
        colors: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug: updateProductDto.slug },
      });

      if (existingProduct) {
        throw new ConflictException('Já existe um produto com este slug');
      }
    }

    // Verificar SKU único se alterado
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });
      if (existingSku) {
        throw new ConflictException('Já existe um produto com este SKU');
      }
    }

    const { images, variants, colors, ...productData } = updateProductDto;

    // Atualizar produto base
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: productData,
    });

    // Se imagens foram fornecidas, atualizar
    if (images !== undefined) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await this.prisma.productImage.createMany({
          data: images.map((img, index) => ({
            productId: id,
            url: img.url,
            alt: img.alt,
            position: img.position ?? index,
            isMain: img.isMain ?? index === 0,
          })),
        });
      }
    }

    // Se variações foram fornecidas, atualizar
    if (variants !== undefined) {
      await this.prisma.productVariant.deleteMany({ where: { productId: id } });
      if (variants.length > 0) {
        await this.prisma.productVariant.createMany({
          data: variants.map(v => ({
            productId: id,
            name: v.name,
            sku: v.sku,
            ncm: v.ncm,
            options: v.options || {},
            price: v.price,
            comparePrice: v.comparePrice,
            costPrice: v.costPrice,
            priceAdjustment: v.priceAdjustment,
            stock: v.stock || 0,
            image: v.image,
            serialNumbers: v.serialNumbers || [],
            isActive: v.isActive !== false,
          })),
        });

        // Atualizar estoque total se hasVariations
        if (productData.hasVariations) {
          const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
          await this.prisma.product.update({
            where: { id },
            data: { stock: totalStock },
          });
        }
      }
    }

    // Se cores foram fornecidas, atualizar
    if (colors !== undefined) {
      await this.prisma.productColor.deleteMany({ where: { productId: id } });
      if (colors.length > 0) {
        await this.prisma.productColor.createMany({
          data: colors.map(c => ({
            productId: id,
            name: c.name,
            hexCode: c.hexCode,
            images: c.images || [],
            stock: c.stock || 0,
            priceModifier: c.priceModifier,
            isDefault: c.isDefault || false,
          })),
        });
      }
    }

    return this.findOne(id);
  }

  async delete(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Produto removido com sucesso' };
  }

  async toggleActive(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: quantity },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });
  }

  // Adicionar/atualizar variação individual
  async addVariant(productId: string, variantData: any) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        ...variantData,
      },
    });

    // Atualizar estoque total se hasVariations
    if (product.hasVariations) {
      const variants = await this.prisma.productVariant.findMany({
        where: { productId },
      });
      const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
      await this.prisma.product.update({
        where: { id: productId },
        data: { stock: totalStock },
      });
    }

    return variant;
  }

  // Atualizar estoque de variação específica
  async updateVariantStock(variantId: string, quantity: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException('Variação não encontrada');
    }

    const updatedVariant = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: quantity },
    });

    // Atualizar estoque total do produto se hasVariations
    if (variant.product.hasVariations) {
      const variants = await this.prisma.productVariant.findMany({
        where: { productId: variant.productId },
      });
      const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
      await this.prisma.product.update({
        where: { id: variant.productId },
        data: { stock: totalStock },
      });
    }

    return updatedVariant;
  }

  // Adicionar número de série a uma variação
  async addSerialNumber(variantId: string, serialNumber: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variação não encontrada');
    }

    const serialNumbers = [...(variant.serialNumbers || []), serialNumber];

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { 
        serialNumbers,
        stock: serialNumbers.length,
      },
    });
  }

  // Remover número de série de uma variação (quando vendido)
  async removeSerialNumber(variantId: string, serialNumber: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variação não encontrada');
    }

    const serialNumbers = (variant.serialNumbers || []).filter(sn => sn !== serialNumber);

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { 
        serialNumbers,
        stock: serialNumbers.length,
      },
    });
  }
} 
