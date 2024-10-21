import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class DetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  id_restaurant: number;

  @IsBoolean()
  @IsNotEmpty()
  multiple: boolean;

  @IsArray({ each: true })
  @IsNotEmpty()
  @IsString()
  data: string[];
}