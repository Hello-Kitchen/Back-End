import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';

enum DataType {
  TYPE1 = 'text',
  TYPE2 = 'food',
}

class DataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DataType)
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
