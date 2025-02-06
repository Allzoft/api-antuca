import { Exclude } from 'class-transformer';
import { Orders } from 'src/orders/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Restaurants } from './restaurant.entity';
import { Role } from './role.entity';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  id_customer: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastname: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 200, default: '-' })
  token: string;

  @Column({ type: 'varchar', length: 10, default: '+591' })
  code_country: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  photo: string;

  @Column({ type: 'tinyint', default: 1, comment: '0: deleted; 1: Active' })
  status: number;

  @Column({ type: 'int', default: 1, nullable: false })
  restaurantIdRestaurant: number;

  @Column({ type: 'int', default: 1, nullable: false })
  roleIdRole: number;

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

  @OneToMany(() => Orders, (order) => order.customer)
  orders: Orders[];

  @ManyToOne(() => Restaurants, (restaurant) => restaurant.customers)
  restaurant: Restaurants;

  @ManyToOne(() => Role, (role) => role.customers)
  role: Role;
}
