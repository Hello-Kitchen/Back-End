import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UsersDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  id_restaurant: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}