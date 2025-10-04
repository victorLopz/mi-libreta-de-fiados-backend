// src/auth/dto/auth.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty() @IsString() name: string;
  @IsEmail() email: string;
  @MinLength(8) password: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsNotEmpty() password: string;
}

export class RefreshDto {
  @IsOptional() @IsString() refreshToken?: string; // si usas body en lugar de cookie
}
