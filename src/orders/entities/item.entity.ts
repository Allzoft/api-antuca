import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrdersItemsItems } from './order-item-item.entity';

@Entity()
export class Items {
  @PrimaryGeneratedColumn()
  id_item: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 15 })
  price: number;

  @Column({ type: 'tinyint', default: '1' })
  available: number;

  @Column({ type: 'tinyint', default: '1' })
  status: number;

  @OneToMany(() => OrdersItemsItems, (orderItem) => orderItem.order)
  orderItems: OrdersItemsItems[];
}
