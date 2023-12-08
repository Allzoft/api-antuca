import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
export class CreateClientDto {
  @PrimaryGeneratedColumn()
  id_client?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  photo: string;

  @IsString()
  @IsOptional()
  code_country?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNumber()
  @IsOptional()
  isActive?: number;

  @IsOptional()
  @IsString()
  id?: string;

  @IsNumber()
  type_business: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  info?: string;

  @IsOptional()
  @IsNumber()
  google?: number;

  @IsNumber()
  @IsOptional()
  status?: number;
}
