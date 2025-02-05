import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
export class CreateItemDto {
  @PrimaryGeneratedColumn()
  id_item: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  type_item: number;

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
  restaurantIdResturant: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
