import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { TableDto } from '../../table/DTO/table.dto';

export class ConfigDto {
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
}
