// src/auth/dto/auth.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  name!: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico del usuario',
  })
  email!: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña segura (mínimo 8 caracteres)',
  })
  password!: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsNotEmpty() password: string;
}

export class RefreshDto {
  @IsOptional() @IsString() refreshToken?: string; // si usas body en lugar de cookie
}
