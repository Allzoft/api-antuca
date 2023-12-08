import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
export class CreateItemDto {
  @PrimaryGeneratedColumn()
  id_item: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsDecimal()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  available: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
