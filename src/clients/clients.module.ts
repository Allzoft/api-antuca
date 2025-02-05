import { Module } from '@nestjs/common';
import { Clients } from './entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './services/clients.service';
import { Orders } from 'src/orders/entities/order.entity';
import { UserContextModule } from 'src/userContext/userContext.module';

@Module({
  imports: [TypeOrmModule.forFeature([Clients, Orders]), UserContextModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
