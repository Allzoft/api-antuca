import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Customers } from './../../costumers/entities/customer.entity';
import { States } from 'src/admin/entities/state.entity';
import { PaymentType } from 'src/admin/entities/paymentType.entity';
import { Clients } from 'src/clients/entities/client.entity';
import { OrdersItemsItems } from './order-item-item.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id_order: number;

  @Column({ type: 'int' })
  customerIdCustomer: number;

  @Column({ type: 'int' })
  clientIdClient: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'int' })
  stateIdState: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'int' })
  paymentTypeIdPaymentType: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 20, default: 'En sala' })
  service_mode: string;

  @Column({ type: 'tinyint', default: 1, comment: '0: deleted; 1: Active' })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Customers, (customer) => customer.orders)
  customer: Customers;

  @ManyToOne(() => Clients, (client) => client.orders)
  client: Clients;

  @ManyToOne(() => States, (state) => state.orders)
  state: States;

  @ManyToOne(() => PaymentType, (paymentType) => paymentType.orders)
  paymentType: PaymentType;

  @OneToMany(() => OrdersItemsItems, (orderItem) => orderItem.order)
  orderItems: OrdersItemsItems[];
}
