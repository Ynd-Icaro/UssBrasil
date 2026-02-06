import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
  }>;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.hostinger.com'),
      port: this.configService.get('SMTP_PORT', 465),
      secure: this.configService.get('SMTP_SECURE', 'true') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"USSBRASIL" <${this.configService.get('SMTP_USER')}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado para ${options.to}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`, error.stack);
      return false;
    }
  }

  // Templates de Email

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const html = this.getWelcomeTemplate(name);
    return this.sendMail({
      to,
      subject: 'Bem-vindo à USSBRASIL! 🎉',
      html,
    });
  }

  async sendOrderConfirmation(
    to: string,
    orderData: {
      orderNumber: string;
      customerName: string;
      items: Array<{ name: string; quantity: number; price: number }>;
      total: number;
      shippingAddress: string;
    },
  ): Promise<boolean> {
    const html = this.getOrderConfirmationTemplate(orderData);
    return this.sendMail({
      to,
      subject: `Pedido #${orderData.orderNumber} confirmado! ✅`,
      html,
    });
  }

  async sendOrderStatusUpdate(
    to: string,
    data: {
      orderNumber: string;
      customerName: string;
      status: string;
      statusMessage: string;
      trackingCode?: string;
    },
  ): Promise<boolean> {
    const html = this.getOrderStatusTemplate(data);
    return this.sendMail({
      to,
      subject: `Atualização do Pedido #${data.orderNumber}`,
      html,
    });
  }

  async sendPasswordReset(to: string, name: string, resetLink: string): Promise<boolean> {
    const html = this.getPasswordResetTemplate(name, resetLink);
    return this.sendMail({
      to,
      subject: 'Redefinição de Senha - USSBRASIL',
      html,
    });
  }

  async sendContactNotification(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<boolean> {
    const html = this.getContactNotificationTemplate(data);
    const adminEmail = this.configService.get('SMTP_USER') || 'contato@ussbrasil.com.br';
    return this.sendMail({
      to: adminEmail,
      subject: `Nova mensagem de contato: ${data.name}`,
      html,
    });
  }

  // Templates HTML

  private getBaseTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>USSBRASIL</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #09090b; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #000000; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                      USS<span style="color: #000000;">BRASIL</span>
                    </h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    ${content}
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #000000; padding: 30px; text-align: center; border-top: 1px solid #27272a;">
                    <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">
                      USSBRASIL - Tecnologia Premium
                    </p>
                    <p style="margin: 0 0 10px; color: #71717a; font-size: 12px;">
                      Praça Nereu Ramos, 364 - Centro, Criciúma/SC
                    </p>
                    <p style="margin: 0; color: #71717a; font-size: 12px;">
                      (48) 3045-6044 | contato@ussbrasil.com.br
                    </p>
                    <div style="margin-top: 20px;">
                      <a href="https://instagram.com/comercialussbrasil" style="color: #eab308; text-decoration: none; font-size: 12px;">
                        @comercialussbrasil
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private getWelcomeTemplate(name: string): string {
    const content = `
      <h2 style="margin: 0 0 20px; color: #fafafa; font-size: 24px; font-weight: 600;">
        Olá, ${name}! 👋
      </h2>
      <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
        Seja muito bem-vindo(a) à <strong style="color: #eab308;">USSBRASIL</strong>! Estamos felizes em ter você conosco.
      </p>
      <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
        Agora você tem acesso a produtos de tecnologia premium das melhores marcas do mundo, com garantia e atendimento especializado.
      </p>
      <div style="margin: 30px 0;">
        <a href="${this.configService.get('FRONTEND_URL', 'https://ussbrasil.com.br')}/products" style="display: inline-block; background-color: #eab308; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Explorar Produtos
        </a>
      </div>
      <p style="margin: 0; color: #71717a; font-size: 14px;">
        Qualquer dúvida, estamos à disposição!
      </p>
    `;
    return this.getBaseTemplate(content);
  }

  private getOrderConfirmationTemplate(data: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    shippingAddress: string;
  }): string {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #fafafa;">${item.name}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #a1a1aa; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #eab308; text-align: right;">R$ ${item.price.toFixed(2)}</td>
        </tr>
      `,
      )
      .join('');

    const content = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="color: #ffffff; font-size: 30px;">✓</span>
        </div>
        <h2 style="margin: 0; color: #fafafa; font-size: 24px; font-weight: 600;">
          Pedido Confirmado!
        </h2>
      </div>

      <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
        Olá, <strong style="color: #fafafa;">${data.customerName}</strong>! Seu pedido foi recebido e está sendo processado.
      </p>

      <div style="background-color: #18181b; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">Número do Pedido</p>
        <p style="margin: 0; color: #eab308; font-size: 24px; font-weight: 700;">#${data.orderNumber}</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="padding: 12px 0; border-bottom: 2px solid #27272a; color: #71717a; text-align: left; font-weight: 500;">Produto</th>
            <th style="padding: 12px 0; border-bottom: 2px solid #27272a; color: #71717a; text-align: center; font-weight: 500;">Qtd</th>
            <th style="padding: 12px 0; border-bottom: 2px solid #27272a; color: #71717a; text-align: right; font-weight: 500;">Preço</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 16px 0; color: #fafafa; font-weight: 600; font-size: 18px;">Total</td>
            <td style="padding: 16px 0; color: #eab308; font-weight: 700; font-size: 20px; text-align: right;">R$ ${data.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background-color: #18181b; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
        <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">Endereço de Entrega</p>
        <p style="margin: 0; color: #fafafa; font-size: 14px; line-height: 1.6;">${data.shippingAddress}</p>
      </div>

      <div style="text-align: center;">
        <a href="${this.configService.get('FRONTEND_URL', 'https://ussbrasil.com.br')}/account/orders" style="display: inline-block; background-color: #eab308; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Acompanhar Pedido
        </a>
      </div>
    `;
    return this.getBaseTemplate(content);
  }

  private getOrderStatusTemplate(data: {
    orderNumber: string;
    customerName: string;
    status: string;
    statusMessage: string;
    trackingCode?: string;
  }): string {
    const statusColors: Record<string, string> = {
      processing: '#eab308',
      shipped: '#3b82f6',
      delivered: '#22c55e',
      cancelled: '#ef4444',
    };

    const statusIcons: Record<string, string> = {
      processing: '⏳',
      shipped: '📦',
      delivered: '✅',
      cancelled: '❌',
    };

    const statusColor = statusColors[data.status] || '#eab308';
    const statusIcon = statusIcons[data.status] || '📋';

    const content = `
      <h2 style="margin: 0 0 20px; color: #fafafa; font-size: 24px; font-weight: 600;">
        ${statusIcon} Atualização do Pedido
      </h2>

      <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
        Olá, <strong style="color: #fafafa;">${data.customerName}</strong>!
      </p>

      <div style="background-color: #18181b; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid ${statusColor};">
        <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">Pedido #${data.orderNumber}</p>
        <p style="margin: 0; color: ${statusColor}; font-size: 20px; font-weight: 600;">${data.statusMessage}</p>
      </div>

      ${
        data.trackingCode
          ? `
        <div style="background-color: #18181b; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
          <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">Código de Rastreamento</p>
          <p style="margin: 0; color: #eab308; font-size: 18px; font-weight: 600; font-family: monospace;">${data.trackingCode}</p>
        </div>
      `
          : ''
      }

      <div style="text-align: center;">
        <a href="${this.configService.get('FRONTEND_URL', 'https://ussbrasil.com.br')}/account/orders" style="display: inline-block; background-color: #eab308; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Ver Detalhes do Pedido
        </a>
      </div>
    `;
    return this.getBaseTemplate(content);
  }

  private getPasswordResetTemplate(name: string, resetLink: string): string {
    const content = `
      <h2 style="margin: 0 0 20px; color: #fafafa; font-size: 24px; font-weight: 600;">
        🔐 Redefinição de Senha
      </h2>

      <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
        Olá, <strong style="color: #fafafa;">${name}</strong>!
      </p>

      <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
        Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="display: inline-block; background-color: #eab308; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Redefinir Senha
        </a>
      </div>

      <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">
        Este link expira em 1 hora.
      </p>

      <p style="margin: 0; color: #71717a; font-size: 14px;">
        Se você não solicitou essa alteração, ignore este email.
      </p>
    `;
    return this.getBaseTemplate(content);
  }

  private getContactNotificationTemplate(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): string {
    const content = `
      <h2 style="margin: 0 0 20px; color: #fafafa; font-size: 24px; font-weight: 600;">
        📬 Nova Mensagem de Contato
      </h2>

      <div style="background-color: #18181b; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #27272a;">
              <span style="color: #71717a;">Nome:</span>
              <span style="color: #fafafa; margin-left: 10px;">${data.name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #27272a;">
              <span style="color: #71717a;">Email:</span>
              <a href="mailto:${data.email}" style="color: #eab308; margin-left: 10px; text-decoration: none;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <span style="color: #71717a;">Telefone:</span>
              <a href="tel:${data.phone}" style="color: #eab308; margin-left: 10px; text-decoration: none;">${data.phone}</a>
            </td>
          </tr>
        </table>
      </div>

      <div style="background-color: #18181b; border-radius: 12px; padding: 20px;">
        <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">Mensagem:</p>
        <p style="margin: 0; color: #fafafa; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>
    `;
    return this.getBaseTemplate(content);
  }
}
