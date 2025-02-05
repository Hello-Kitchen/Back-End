import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class TableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  x: number;

  @IsNumber()
  @IsNotEmpty()
  y: number;

  @IsOptional()
  @IsNumber()
  id?: number;
}
