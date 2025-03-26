import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsEnum,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { FoodOrderedDto } from './food_ordered.dto';
import { Type } from 'class-transformer';

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

  @IsBoolean()
  @IsNotEmpty()
  served: boolean;

  @IsNumber()
  @IsNotEmpty()
  part: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodOrderedDto)
  food_ordered: FoodOrderedDto[];

  @IsOptional()
  @IsNumber()
  total?: number

  @IsOptional()
  @IsNumber()
  id?: number;
}
