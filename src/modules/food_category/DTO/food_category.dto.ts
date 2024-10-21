import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class FoodCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  id_restaurant: number;
}