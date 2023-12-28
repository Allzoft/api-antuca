import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrdersItemsItems } from './order-item-item.entity';
import { DailyAvailability } from './dailyAvailability.entity';

@Entity()
export class Items {
  @PrimaryGeneratedColumn()
  id_item: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', comment: '0: Sopa, 1: Segundos, 2: others' })
  type_item: number;

  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  photo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 15 })
  price: number;

  @Column({ type: 'tinyint', default: '1' })
  available: number;

  @Column({ type: 'tinyint', default: '1' })
  status: number;

  @OneToMany(() => OrdersItemsItems, (orderItem) => orderItem.order)
  orderItems: OrdersItemsItems[];

  @OneToMany(
    () => DailyAvailability,
    (dailyAvailability) => dailyAvailability.item,
  )
  dailyAvailability: DailyAvailability[];
}
