import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { TableDto } from '../../table/DTO/table.dto';
import { Type } from 'class-transformer';

export class PosConfigDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableDto)
  tables: TableDto[];

  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsOptional()
  @IsNumber()
  id?: number;
}
