import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class FoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  id_category: number;

  @IsArray()
  ingredients: number[];

  @IsArray()
  details: number[];
}
