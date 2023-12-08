import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Clients {
  @PrimaryGeneratedColumn()
  id_client: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  lastname: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  photo: string;

  @Column({ type: 'varchar', length: 30 })
  code_country: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'tinyint', default: 1 })
  isActive: number;

  @Column({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'int' })
  type_business: number;

  @Column({ type: 'varchar', length: 20 })
  gender: string;

  @Column({ type: 'varchar', length: 1000 })
  info: string;

  @Column({ type: 'int' })
  google: number;

  @Column({ type: 'tinyint', default: 1, comment: '1: show: 0: deleted' })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
