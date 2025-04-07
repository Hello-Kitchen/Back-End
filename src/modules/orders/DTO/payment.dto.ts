import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';

enum ValueType {
  TYPE1 = 'cb',
  TYPE2 = 'cash',
  TYPE3 = 'tr',
}

class ValueDto {
  @IsEnum(ValueType)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class PaymentDto {
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueDto)
  value: ValueDto[];

  @IsNumber()
  @IsNotEmpty()
  user: number;
}
