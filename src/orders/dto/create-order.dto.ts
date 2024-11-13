import {
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PrimaryGeneratedColumn } from 'typeorm';
import { CreateOrderItemDto } from './create-order-item.dto';
import { ServiceMode } from '../entities/order.entity';

export class CreateOrderDto {
  @PrimaryGeneratedColumn()
  id_order: number;

  @IsNumber()
  @IsNotEmpty()
  customerIdCustomer: number;

  @IsNumber()
  @IsNotEmpty()
  clientIdClient: number;

  @IsDate()
  @Transform(({ value }) => value && new Date(value))
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

  @IsEnum(ServiceMode)
  @IsNotEmpty()
  service_mode: ServiceMode;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsNotEmpty()
  items: CreateOrderItemDto[];
}
