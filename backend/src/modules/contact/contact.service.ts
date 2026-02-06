import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MailService } from '@/common/mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    // Salvar no banco de dados
    const contact = await this.prisma.contact.create({
      data: createContactDto,
    });

    // Enviar email de notificação para o admin
    try {
      await this.mailService.sendContactNotification({
        name: createContactDto.name,
        email: createContactDto.email,
        phone: createContactDto.phone || '',
        message: createContactDto.message,
      });
    } catch (error) {
      this.logger.error('Erro ao enviar notificação de contato:', error);
      // Não falhar a requisição se o email não for enviado
    }

    return {
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      id: contact.id,
    };
  }

  async findAll(page = 1, limit = 20, isRead?: boolean) {
    const skip = (page - 1) * limit;

    const where = isRead !== undefined ? { isRead } : {};

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      data: contacts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async delete(id: string) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }

  async getUnreadCount() {
    const count = await this.prisma.contact.count({
      where: { isRead: false },
    });
    return { count };
  }
}
