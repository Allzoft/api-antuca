import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateStatesDto {
  @PrimaryGeneratedColumn()
  id_state: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  type: string;

  @IsString()
  color: string;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsNumber()
  priority: number;
}
