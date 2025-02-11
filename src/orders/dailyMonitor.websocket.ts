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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserContextService } from 'src/userContext/service/userContext.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/services/auth.service';
import { PayloadToken } from 'src/auth/models/token.model';

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
    private ordersRepostory: Repository<Orders>,
    private authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  public createOrder() {}

  public afterInit(server: Server) {
  }

  @UseGuards(JwtAuthGuard)
  public async handleConnection(client: Socket) {
    if(!client.handshake.auth.token) {
      client.disconnect()
    } 

    const token = client.handshake.auth.token.slice(7);
    const payload: PayloadToken = this.authService.decodeUser(token);
    const restaurantId = payload.restaurantIdRestaurant;

    client.join(`restaurant-${restaurantId}`);

    const datestart = new Date();
    datestart.setHours(0, 0, 0, 0);
    datestart.setHours(datestart.getHours() - 4);

    const dateend = new Date();
    dateend.setHours(23, 59, 59, 999);
    dateend.setHours(dateend.getHours() - 4);
    try {
      client.emit('message', `Conexión exitosa: ${client.id}`);
      const orders = await this.ordersRepostory.find({
        relations: [
          'client',
          'customer',
          'state',
          'paymentType',
          'orderItems.item',
        ],
        where: {
          status: 1,
          date: Between(datestart, dateend),
          restaurantIdRestaurant: restaurantId,
        },
        order: {
          created_at: 'DESC',
        },
      });
      client.emit('ordersList', orders);
    } catch (error) {
      console.error('Error during connection:', error.message);
      client.emit('error', 'Error durante la conexión.');
      client.disconnect()
    }
  }

  public handleDisconnect(client: Socket) {
    try {
    } catch (error) {
      console.error('Error during disconnection:', error.message);
    }
  }

  public emitNewOrder(order: Orders) {
    // Emite solo a los clientes que pertenecen al room del restaurante
    this.server.to(`restaurant-${order.restaurantIdRestaurant}`).emit('newOrder', order);
  }
  
  public emitUpdatedOrder(order: Orders) {
    this.server.to(`restaurant-${order.restaurantIdRestaurant}`).emit('updateOrder', order);
  }
  
  public emitDeletedOrder(order: Orders) {
    this.server.to(`restaurant-${order.restaurantIdRestaurant}`).emit('deleteOrder', order);
  }
}
