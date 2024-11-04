import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
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
  mods_ingredients: ModsIngredient[];

  @IsArray()
  details: string[];

  @IsString()
  note: string;
}
