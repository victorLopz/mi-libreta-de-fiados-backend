import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Column({ name: 'full_name', length: 160 })
  fullName!: string;

  @ApiPropertyOptional({ example: '+50588888888' })
  @IsOptional()
  @IsString()
  @Length(6, 30)
  phone?: string;

  @ApiProperty({ example: 'DNI' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @Matches(/^[A-Za-z]+$/)
  @Column({ name: 'doc_id', length: 50 })
  docId!: string;

  @ApiPropertyOptional({ example: 'Av. Central 123' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  address?: string;

  @ApiPropertyOptional({ example: 'Cliente preferencial' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
}
