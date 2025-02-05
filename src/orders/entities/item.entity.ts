import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OrdersItemsItems } from './order-item-item.entity';
import { DailyAvailability } from './dailyAvailability.entity';
import { Restaurants } from 'src/costumers/entities/restaurant.entity';

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

  @Column({ type: 'int', nullable: false, default: 1 })
  restaurantIdResturant: number;

  @Column({ type: 'tinyint', default: '1' })
  status: number;

  @ManyToOne(() => Restaurants, (restaurant) => restaurant.items)
  restaurant: Restaurants;

  @OneToMany(() => OrdersItemsItems, (orderItem) => orderItem.order)
  orderItems: OrdersItemsItems[];

  @OneToMany(
    () => DailyAvailability,
    (dailyAvailability) => dailyAvailability.item,
  )
  dailyAvailabilities: DailyAvailability[];
}
