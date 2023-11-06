import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty() 
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty() 
  password: string;
}

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string
}

export class RefreshTokenDTO {
  @IsNumber()
  @IsNotEmpty()
  ID: string

  @IsString()
  @IsNotEmpty()
  refreshToken: string
}