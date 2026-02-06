import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  ForbiddenException 
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: createReviewDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se o usuário já avaliou este produto
    const existingReview = await this.prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: createReviewDto.productId,
          userId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('Você já avaliou este produto');
    }

    // Verificar se o usuário comprou o produto (opcional, mas recomendado)
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: createReviewDto.productId,
        order: {
          userId,
          status: {
            in: ['DELIVERED', 'SHIPPED'],
          },
        },
      },
    });

    // Criar a avaliação
    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        userId,
        // Aprovar automaticamente se o usuário comprou o produto
        isApproved: !!hasPurchased,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return review;
  }

  async findByProduct(productId: string, page = 1, limit = 10, onlyApproved = true) {
    const skip = (page - 1) * limit;

    const where = {
      productId,
      ...(onlyApproved && { isApproved: true }),
    };

    const [reviews, total, stats] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where }),
      this.getProductStats(productId),
    ]);

    return {
      data: reviews,
      stats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductStats(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Distribuição por estrelas
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      distribution[r.rating as keyof typeof distribution]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      distribution,
    };
  }

  async findUserReviews(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                take: 1,
                select: { url: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { userId } }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAll(page = 1, limit = 20, isApproved?: boolean) {
    const skip = (page - 1) * limit;
    const where = isApproved !== undefined ? { isApproved } : {};

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return review;
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto, isAdmin = false) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Apenas o dono ou admin pode editar
    if (review.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para editar esta avaliação');
    }

    // Apenas admin pode alterar isApproved
    if (updateReviewDto.isApproved !== undefined && !isAdmin) {
      delete updateReviewDto.isApproved;
    }

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async approve(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return this.prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async reject(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return this.prisma.review.update({
      where: { id },
      data: { isApproved: false },
    });
  }

  async delete(id: string, userId: string, isAdmin = false) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Apenas o dono ou admin pode excluir
    if (review.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para excluir esta avaliação');
    }

    await this.prisma.review.delete({ where: { id } });

    return { message: 'Avaliação excluída com sucesso' };
  }

  async getPendingCount() {
    const count = await this.prisma.review.count({
      where: { isApproved: false },
    });
    return { count };
  }
}
