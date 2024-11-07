import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
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
}

export class FoodOrderedDto {
  @IsNumber()
  @IsNotEmpty()
  food: number;

  @IsBoolean()
  @IsNotEmpty()
  is_ready: boolean;

  @IsNumber()
  part: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModsIngredient)
  mods_ingredients: ModsIngredient[];

  @IsArray()
  @IsString({ each: true })
  details: string[];

  @IsString()
  note: string;
}
