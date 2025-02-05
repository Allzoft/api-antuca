import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from 'src/clients/entities/client.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './services/reports.service';
import { UserContextModule } from 'src/userContext/userContext.module';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, Clients]), UserContextModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
