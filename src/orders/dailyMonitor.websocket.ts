import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  //   UseGuards,
} from '@nestjs/websockets';
import { spawn } from 'child_process';
import { Server, Socket } from 'socket.io';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { v4 as uuidv4 } from 'uuid';
import { Between, Repository } from 'typeorm';
import { Orders } from './entities/order.entity';

@ApiTags('orders')
@WebSocketGateway({
  namespace: 'ws',
  cors: {
    origin: '*',
  },
})
export class OrdersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(Orders)
    private ordersRepostiry: Repository<Orders>,
  ) {}

  @WebSocketServer() server: Server;

  public createOrder() {}

  public afterInit(server: Server) {
    console.log('Soy el server:', server);
    console.log('WebSocket server initialized');
  }

  public async handleConnection(client: Socket) {
    const datestart = new Date();
    datestart.setHours(0, 0, 0, 0);
    datestart.setHours(datestart.getHours() - 4);  
    
    const dateend = new Date();
    dateend.setHours(23, 59, 59, 999);
    dateend.setHours(dateend.getHours() - 4);
    try {
      console.log('Client connected:', client.id);
      client.emit('message', `Conexión exitosa: ${client.id}`);
      const orders = await this.ordersRepostiry.find({
        relations: [
          'client',
          'customer',
          'state',
          'paymentType',
          'orderItems.item',
        ],
        where: { status: 1, date: Between(datestart, dateend) },
        order: {
          created_at: 'DESC',
        },
      });
      client.emit('ordersList', orders);
    } catch (error) {
      console.error('Error during connection:', error.message);
      client.emit('error', 'Error durante la conexión.');
    }
  }

  public handleDisconnect(client: Socket) {
    try {
      console.log('Client disconnected:', client.id);
    } catch (error) {
      console.error('Error during disconnection:', error.message);
    }
  }

  public emitNewOrder(order: Orders) {
    this.server.emit('newOrder', order);
  }

  public emitUpdatedOrder(order: Orders) {
    this.server.emit('updateOrder', order);
  }

  public emitDeletedOrder(order: Orders) {
    this.server.emit('deleteOrder', order);
  }
}
