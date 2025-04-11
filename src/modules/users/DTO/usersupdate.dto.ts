import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UsersUpdateDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;
}
