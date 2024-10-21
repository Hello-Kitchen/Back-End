import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray, IsObject } from 'class-validator';

export class FoodOrderedDto {
    @IsNumber()
    @IsNotEmpty()
    food: number;

    @IsNumber()
    @IsNotEmpty()
    id_restaurant: number;

    @IsBoolean()
    @IsNotEmpty()
    is_ready: boolean;

    @IsNumber()
    part: number;

    @IsArray({ each: true })
    @IsObject()
    mods_ingredients: { type: string, ingredient: string }[];

    @IsArray({ each: true })
    @IsString()
    details: string[];

    @IsString()
    note: string;
}