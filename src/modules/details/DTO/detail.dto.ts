import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';


class DataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class DetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  multiple: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataDto)
  @IsNotEmpty()
  data: DataDto[]
}
