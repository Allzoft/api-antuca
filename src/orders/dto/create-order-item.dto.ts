import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateOrderItemDto {
  @PrimaryGeneratedColumn()
  id_order_item?: number;

  @IsNumber()
  @IsNotEmpty()
  itemIdItem: number;

  @IsNumber()
  @IsOptional()
  orderIdOrder: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
