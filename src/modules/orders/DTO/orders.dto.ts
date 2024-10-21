import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { FoodOrderedDto } from './food_ordered.dto';

export class OrdersDto {
  @IsNumber()
  @IsNotEmpty()
  id_restaurant: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNumber()
  @IsNotEmpty()
  part: number;

  @IsArray({ each: true })
  food_ordered: FoodOrderedDto[];
}