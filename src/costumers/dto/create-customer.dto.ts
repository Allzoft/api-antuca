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
  
  @IsString()
  @IsOptional()
  code_country: string;
  
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
