import { Module } from '@nestjs/common';
import { Clients } from './entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './services/clients.service';
import { Orders } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients, Orders])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
