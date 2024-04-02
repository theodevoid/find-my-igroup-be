import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @IsString()
  readonly name: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;
}
