import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateCustomerDto {
  @PrimaryGeneratedColumn()
  id_customer: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  token: string;

  @IsNumber()
  @IsNotEmpty()
  roleIdRole: number;

  @IsString()
  @IsOptional()
  code_country: string;

  @IsNumber()
  @IsOptional()
  restaurantIdRestaurant: number;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  photo: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
