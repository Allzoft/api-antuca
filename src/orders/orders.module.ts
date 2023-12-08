import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Items } from './entities/item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './services/items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Items])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class OrdersModule {}
