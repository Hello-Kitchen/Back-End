import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string; // Ancien mot de passe

  @IsString()
  @IsNotEmpty()
  newPassword: string; // Nouveau mot de passe
}
