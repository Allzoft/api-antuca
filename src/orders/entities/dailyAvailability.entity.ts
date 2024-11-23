import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Items } from './item.entity';

@Entity()
export class DailyAvailability {
  @PrimaryGeneratedColumn()
  id_daily_availability: number;

  @Column({ type: 'int' })
  itemIdItem: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  sold: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'tinyint', default: 1, comment: '0: deleted; 1: Active' })
  status: number;

  @ManyToOne(() => Items, (item) => item.dailyAvailabilities)
  item: Items;
}
