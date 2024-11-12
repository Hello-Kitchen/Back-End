import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class FoodCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}
