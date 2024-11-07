import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

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
  @IsNumber({}, { each: true })
  ingredients: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  details: number[];
}
