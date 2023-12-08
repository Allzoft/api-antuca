import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateOrderDto {
  @PrimaryGeneratedColumn()
  id_order: number;

  @IsNumber()
  @IsNotEmpty()
  customerIdCustomer: number;

  @IsNumber()
  @IsNotEmpty()
  clientIdClient: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  stateIdState: number;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsNumber()
  @IsNotEmpty()
  paymentTypeIdPaymentType: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
