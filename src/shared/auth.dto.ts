import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty() 
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty() 
  password: string;
}

export class UpdateTokenDTO {
  @IsNumber()
  @IsNotEmpty()
  ID: number

  @IsString()
  @IsNotEmpty()
  refreshToken: string
}

export class ChangePasswordDTO {
  @IsNotEmpty()
  @IsNumber()
  ID: number

  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  newPassword: string
}