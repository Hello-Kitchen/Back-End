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

  @IsOptional()
  @IsNumber()
  id?: number;
}
