import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

export interface NotificationPayload {
  type: 'order' | 'product' | 'user' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp?: Date;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private pusher: Pusher | null = null;

  constructor(private configService: ConfigService) {
    const appId = this.configService.get('PUSHER_APP_ID');
    const key = this.configService.get('PUSHER_KEY');
    const secret = this.configService.get('PUSHER_SECRET');
    const cluster = this.configService.get('PUSHER_CLUSTER', 'sa1');

    if (appId && key && secret) {
      this.pusher = new Pusher({
        appId,
        key,
        secret,
        cluster,
        useTLS: true,
      });
      this.logger.log('Pusher inicializado com sucesso');
    } else {
      this.logger.warn('Pusher não configurado - notificações desabilitadas');
    }
  }

  // Notificar todos os admins sobre novo pedido
  async notifyNewOrder(orderData: {
    orderId: string;
    orderNumber: string;
    customerName: string;
    total: number;
    itemCount: number;
  }): Promise<void> {
    const payload: NotificationPayload = {
      type: 'order',
      title: '🛒 Novo Pedido!',
      message: `Pedido #${orderData.orderNumber} de ${orderData.customerName}`,
      data: orderData,
      timestamp: new Date(),
    };

    await this.sendToChannel('admin-notifications', 'new-order', payload);
  }

  // Notificar atualização de status do pedido
  async notifyOrderStatusUpdate(data: {
    orderId: string;
    orderNumber: string;
    userId: string;
    status: string;
    statusMessage: string;
  }): Promise<void> {
    const payload: NotificationPayload = {
      type: 'order',
      title: '📦 Atualização do Pedido',
      message: `Pedido #${data.orderNumber}: ${data.statusMessage}`,
      data,
      timestamp: new Date(),
    };

    // Notificar o cliente específico
    await this.sendToChannel(`user-${data.userId}`, 'order-update', payload);
    
    // Notificar admins
    await this.sendToChannel('admin-notifications', 'order-update', payload);
  }

  // Notificar estoque baixo
  async notifyLowStock(productData: {
    productId: string;
    productName: string;
    sku: string;
    currentStock: number;
    minStock: number;
  }): Promise<void> {
    const payload: NotificationPayload = {
      type: 'product',
      title: '⚠️ Estoque Baixo',
      message: `${productData.productName} (${productData.sku}) - ${productData.currentStock} unidades`,
      data: productData,
      timestamp: new Date(),
    };

    await this.sendToChannel('admin-notifications', 'low-stock', payload);
  }

  // Notificar novo cadastro de usuário
  async notifyNewUser(userData: {
    userId: string;
    name: string;
    email: string;
  }): Promise<void> {
    const payload: NotificationPayload = {
      type: 'user',
      title: '👤 Novo Cadastro',
      message: `${userData.name} (${userData.email})`,
      data: userData,
      timestamp: new Date(),
    };

    await this.sendToChannel('admin-notifications', 'new-user', payload);
  }

  // Notificação genérica para um usuário
  async notifyUser(
    userId: string,
    title: string,
    message: string,
    data?: Record<string, any>,
  ): Promise<void> {
    const payload: NotificationPayload = {
      type: 'system',
      title,
      message,
      data,
      timestamp: new Date(),
    };

    await this.sendToChannel(`user-${userId}`, 'notification', payload);
  }

  // Broadcast para todos os usuários conectados
  async broadcast(title: string, message: string, data?: Record<string, any>): Promise<void> {
    const payload: NotificationPayload = {
      type: 'system',
      title,
      message,
      data,
      timestamp: new Date(),
    };

    await this.sendToChannel('public', 'broadcast', payload);
  }

  // Método interno para enviar ao Pusher
  private async sendToChannel(
    channel: string,
    event: string,
    data: NotificationPayload,
  ): Promise<void> {
    if (!this.pusher) {
      this.logger.debug(`[Mock] ${channel}/${event}: ${data.title}`);
      return;
    }

    try {
      await this.pusher.trigger(channel, event, data);
      this.logger.debug(`Notificação enviada: ${channel}/${event}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação: ${error.message}`);
    }
  }

  // Autenticação para canais privados (Pusher)
  async authenticateUser(socketId: string, channel: string, userId: string): Promise<any> {
    if (!this.pusher) {
      return null;
    }

    // Verificar se o usuário pode acessar o canal
    if (channel.startsWith('private-user-')) {
      const channelUserId = channel.replace('private-user-', '');
      if (channelUserId !== userId) {
        throw new Error('Acesso negado ao canal');
      }
    }

    return this.pusher.authorizeChannel(socketId, channel);
  }
}
