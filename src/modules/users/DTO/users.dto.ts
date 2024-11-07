import { IsString, IsNotEmpty } from 'class-validator';

export class UsersDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
