import { Orders } from 'src/orders/entities/order.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class PaymentType {
  @PrimaryGeneratedColumn()
  id_payment_type: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

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

  @OneToMany(() => Orders, (order) => order.paymentType)
  orders: Orders[];
}
