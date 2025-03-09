import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class InitiateRecoveryDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CompleteRecoveryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
} 