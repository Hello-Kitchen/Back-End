import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class TableDto {
  @IsNumber()
  @IsOptional()
  x?: number;

  @IsNumber()
  @IsOptional()
  y?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsOptional()
  plates: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  time: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}
