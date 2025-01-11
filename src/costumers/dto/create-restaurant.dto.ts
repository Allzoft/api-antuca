import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeSubscription } from 'src/costumers/entities/restaurant.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateRestaurantDto {
  @PrimaryGeneratedColumn()
  id_restaurant: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  logo_image: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsString()
  @IsOptional()
  code_country: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  owner: string;

  @IsString()
  @IsOptional()
  owner_phone: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsNumber()
  @IsOptional()
  max_capacity: number;

  @IsString()
  @IsOptional()
  schedule: string;

  @IsOptional()
  @IsEnum(TypeSubscription)
  subscription: TypeSubscription;

  @IsString()
  @IsOptional()
  type_cuisine: string;

  @IsString()
  @IsOptional()
  primary_color: string;

  @IsString()
  @IsOptional()
  secondary_color: string;

  @IsNumber()
  @IsOptional()
  allow_notifications: number;

  @IsNumber()
  @IsOptional()
  is_enabled: number; 
}
