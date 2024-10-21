import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  id_restaurant: number;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string
}