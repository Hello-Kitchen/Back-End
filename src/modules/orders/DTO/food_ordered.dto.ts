import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';

enum ModsIngredientType {
  TYPE1 = 'DEL',
  TYPE2 = 'ADD',
  TYPE3 = 'ALE',
}

class ModsIngredient {
  @IsEnum(ModsIngredientType)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  ingredient: string;

  @IsOptional()
  @IsString()
  suppPrice?: string;
}

export class FoodOrderedDto {
  @IsNumber()
  @IsNotEmpty()
  food: number;

  @IsString()
  @IsOptional()
  price?: string;

  @IsBoolean()
  @IsNotEmpty()
  is_ready: boolean;

  @IsOptional()
  @IsNumber()
  part?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModsIngredient)
  mods_ingredients?: ModsIngredient[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  details?: string[];

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}
