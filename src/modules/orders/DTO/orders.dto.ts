import { IsString, IsNotEmpty, IsNumber, IsArray, IsEnum } from 'class-validator';
import { FoodOrderedDto } from './food_ordered.dto';

enum Channel {
  TYPE1 = 'Sur place',
  TYPE2 = 'A emporter',
  TYPE3 = 'LAD',
}

export class OrdersDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsEnum(Channel)
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
