import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class IngredientDto {
  @IsNumber()
  @IsNotEmpty()
  id_ingredient: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  suppPrice?: number;
}

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

  @IsOptional()
  @IsArray()
  ingredients?: IngredientDto[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  details?: number[];

  @IsOptional()
  @IsNumber()
  id?: number;
}
