import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customers } from './customer.entity';
import { Clients } from 'src/clients/entities/client.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { Items } from 'src/orders/entities/item.entity';

export enum TypeSubscription {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

@Entity()
export class Restaurants {
  @PrimaryGeneratedColumn()
  id_restaurant: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo_image: string;

  @Column({ type: 'tinyint', default: 1, comment: '0: deleted; 1: Active' })
  is_enabled: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code_country: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  owner: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  owner_phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'int', nullable: true })
  max_capacity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  schedule: string;

  @Column({
    type: 'enum',
    enum: TypeSubscription,
    default: TypeSubscription.BASIC,
  })
  subscription: TypeSubscription;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type_cuisine: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  primary_color: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  secondary_color: string;

  @Column({ type: 'tinyint', default: 1 })
  allow_notifications: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updated_at: Date;

  @OneToMany(() => Customers, (customer) => customer.restaurant)
  customers: Customers[];

  @OneToMany(() => Clients, (client) => client.restaurant)
  clients: Clients[];

  @OneToMany(() => Orders, (order) => order.restaurant)
  orders: Orders[];

  @OneToMany(() => Items, (item) => item.restaurant)
  items: Items[];
}
