import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateCustomerDto {
  @PrimaryGeneratedColumn()
  id_customer: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  code_country: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  photo: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
