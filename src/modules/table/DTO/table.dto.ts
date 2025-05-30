import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @IsNumber()
  orderId?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TableDto)
  fused: TableDto[];
}
