import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedClients: Map<string, { socket: Socket; userId?: string; isAdmin: boolean }> =
    new Map();

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Cliente conectado: ${client.id}`);
    this.connectedClients.set(client.id, { socket: client, isAdmin: false });
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Cliente desconectado: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; isAdmin?: boolean },
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      clientInfo.userId = data.userId;
      clientInfo.isAdmin = data.isAdmin || false;

      // Join rooms baseado no tipo de usuário
      client.join(`user-${data.userId}`);
      if (data.isAdmin) {
        client.join('admin-room');
      }

      this.logger.debug(`Usuário autenticado: ${data.userId} (Admin: ${data.isAdmin})`);
    }
  }

  // Enviar notificação para um usuário específico
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user-${userId}`).emit(event, data);
  }

  // Enviar notificação para todos os admins
  sendToAdmins(event: string, data: any) {
    this.server.to('admin-room').emit(event, data);
  }

  // Broadcast para todos os conectados
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Obter número de clientes conectados
  getConnectedCount(): number {
    return this.connectedClients.size;
  }

  // Obter admins conectados
  getConnectedAdmins(): number {
    return Array.from(this.connectedClients.values()).filter((c) => c.isAdmin).length;
  }
}
