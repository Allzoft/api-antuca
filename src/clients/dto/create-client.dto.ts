import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TypeBusiness } from '../entities/client.entity';
import { Gender } from 'src/enums/gender.enum';
export class CreateClientDto {
  @PrimaryGeneratedColumn()
  id_client?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsOptional()
  @IsEmail()
  email?: string;

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

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsEnum(TypeBusiness)
  type_business: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

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
