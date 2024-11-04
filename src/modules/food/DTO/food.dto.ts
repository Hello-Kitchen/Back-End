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
  @IsNumber({}, { each: true })
  ingredients: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  details: number[];
}
