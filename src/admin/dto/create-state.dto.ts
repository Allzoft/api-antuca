import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { StateType } from '../entities/state.entity';

export class CreateStatesDto {
  @PrimaryGeneratedColumn()
  id_state: number;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  @IsEnum(StateType)
  type: StateType;


  @IsNumber()
  @IsOptional()
  status: number;

  @IsNumber()
  priority: number;
}
