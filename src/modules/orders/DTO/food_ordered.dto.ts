import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';

class ModsIngredient {
  @IsString()
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
