import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { IngredientService } from 'src/modules/ingredient/ingredient.service';

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

    @IsNumber()
    id_restaurant: number;

    @IsArray({ each: true })
    @IsNumber()
    ingredients: number[];

    @IsArray({ each: true })
    @IsNumber()
    details: number[];
}