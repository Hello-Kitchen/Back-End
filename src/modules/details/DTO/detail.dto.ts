import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class DetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  multiple: boolean;

  @IsArray()
  @IsNotEmpty()
  data: { type: string, name: string }[];
}
