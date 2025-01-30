import { Exclude } from 'class-transformer';
import { Orders } from '../../orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Restaurants } from 'src/costumers/entities/restaurant.entity';
import { Gender } from 'src/enums/gender.enum';

export enum TypeBusiness {
  B2B = 'B2B',
  B2C = 'B2C',
}

@Entity()
export class Clients {
  @PrimaryGeneratedColumn()
  id_client: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  lastname: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  photo: string;

  @Column({ type: 'varchar', length: 30 })
  code_country: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 50 })
  id: string;

  @Column({
    type: 'enum',
    enum: TypeBusiness,
    nullable: false,
    default: TypeBusiness.B2C,
  })
  type_business: TypeBusiness;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
    default: Gender.MASCULINO,
  })
  gender: Gender;

  @Column({ type: 'varchar', length: 1000 })
  info: string;

  @Column({ type: 'int' })
  google: number;

  @Column({ type: 'tinyint', default: 1, comment: '1: show: 0: deleted' })
  status: number = 1;

  @Column({ type: 'int', nullable: true })
  restaurantIdRestaurant: number;

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

  @OneToMany(() => Orders, (order) => order.client)
  orders: Orders[];

  @ManyToOne(() => Restaurants, (restaurant) => restaurant.clients)
  restaurant: Restaurants;
}
