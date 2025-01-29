import { Orders } from 'src/orders/entities/order.entity';

import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum StateType {
  ORDER_STATUS = 'Order',
  PAYMENT_STATUS = 'Payment',
  SHIPPING_STATUS = 'Shipping',
}

@Entity()
export class States {
  @PrimaryGeneratedColumn()
  id_state: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: StateType,
    nullable: false,
    default: StateType.ORDER_STATUS,
  })
  type: StateType;

  @Column({ type: 'int', nullable: false, default: 1 })
  priority: number;

  @Column({ type: 'tinyint', default: 1, comment: '0: deleted; 1: Active' })
  status: number = 1;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  created_at: Date = new Date(); ;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updated_at: Date = new Date();

  @OneToMany(() => Orders, (order) => order.state)
  orders: Orders[];
}
