import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';

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
  mods_ingredients: { type: string; ingredient: string }[];

  @IsArray()
  details: string[];

  @IsString()
  note: string;
}
