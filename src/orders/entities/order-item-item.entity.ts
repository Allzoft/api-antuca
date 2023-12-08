import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Orders } from './order.entity';
import { Items } from './item.entity';
@Entity()
export class OrdersItemsItems {
  @PrimaryGeneratedColumn()
  id_order_item: number;

  @Column({ type: 'int' })
  orderIdOrder: number;

  @Column({ type: 'int' })
  itemIdItem: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Orders, (order) => order.orderItems)
  order: Orders;

  @ManyToOne(() => Items, (item) => item.orderItems)
  item: Items;
}
