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
export class States {
  @PrimaryGeneratedColumn()
  id_state: number;

  @Column({ type: 'varchar', length: undefined })
  name: string;

  @Column({ type: 'varchar', length: undefined })
  type: string;

  @Column({ type: 'int' })
  priority: number;

  @Column({ type: 'varchar', length: undefined })
  color: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

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

  @OneToMany(() => Orders, (order) => order.state)
  orders: Orders[];
}
