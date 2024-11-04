import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UsersDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
