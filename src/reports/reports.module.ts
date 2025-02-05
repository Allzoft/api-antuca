import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders])], 
  controllers: [],
  providers: [],
})
export class UserContextModule {}
