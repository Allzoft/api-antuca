import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateDailyAvailabilityDto {
  @PrimaryGeneratedColumn()
  id_daily_availability: number;

  @IsNumber()
  @IsNotEmpty()
  itemIdItem: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  date: Date;

  @IsOptional()
  status: number;
}
