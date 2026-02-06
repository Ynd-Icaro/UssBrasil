import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(dto: SubscribeDto) {
    const existing = await this.prisma.newsletter.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Este e-mail já está inscrito na newsletter');
      }
      // Reativar inscrição
      return this.prisma.newsletter.update({
        where: { email: dto.email.toLowerCase() },
        data: { isActive: true },
      });
    }

    return this.prisma.newsletter.create({
      data: {
        email: dto.email.toLowerCase(),
      },
    });
  }

  async unsubscribe(email: string) {
    const subscription = await this.prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!subscription) {
      throw new NotFoundException('E-mail não encontrado na newsletter');
    }

    return this.prisma.newsletter.update({
      where: { email: email.toLowerCase() },
      data: { isActive: false },
    });
  }

  async getAllSubscribers(includeInactive = false) {
    return this.prisma.newsletter.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [total, active] = await Promise.all([
      this.prisma.newsletter.count(),
      this.prisma.newsletter.count({ where: { isActive: true } }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
    };
  }

  async deleteSubscriber(email: string) {
    const subscription = await this.prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!subscription) {
      throw new NotFoundException('E-mail não encontrado');
    }

    return this.prisma.newsletter.delete({
      where: { email: email.toLowerCase() },
    });
  }
}
