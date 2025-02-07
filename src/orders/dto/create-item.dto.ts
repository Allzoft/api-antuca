import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TypeItem } from '../entities/item.entity';
export class CreateItemDto {
  @PrimaryGeneratedColumn()
  id_item: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(TypeItem)
  type_item: TypeItem;

  @IsString()
  @IsOptional()
  photo: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  restaurantIdRestaurant: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
