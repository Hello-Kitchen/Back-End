import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class TableDto {
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsNumber()
  @IsNotEmpty()
  x: number;

  @IsNumber()
  @IsNotEmpty()
  y: number;

  @IsNumber()
  @IsNotEmpty()
  shape: number;

  @IsOptional()
  @IsNumber()
  id?: number;
}
