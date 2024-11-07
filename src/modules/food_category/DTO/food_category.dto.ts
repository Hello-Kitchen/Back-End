import { IsString, IsNotEmpty } from 'class-validator';

export class FoodCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
