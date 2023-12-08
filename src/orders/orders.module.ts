import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Items } from './entities/item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './services/items.service';
import { Orders } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';
import { Clients } from 'src/clients/entities/client.entity';
import { Customers } from 'src/costumers/entities/customer.entity';
import { PaymentType } from 'src/admin/entities/paymentType.entity';
import { States } from 'src/admin/entities/state.entity';
import { OrdersItemsItems } from './entities/order-item-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Items,
      Orders,
      Clients,
      Customers,
      PaymentType,
      States,
      OrdersItemsItems,
    ]),
  ],
  controllers: [ItemsController, OrdersController],
  providers: [ItemsService, OrdersService],
})
export class OrdersModule {}
