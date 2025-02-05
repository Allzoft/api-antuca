import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from 'src/clients/entities/client.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, Clients])], 
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class UserContextModule {}
