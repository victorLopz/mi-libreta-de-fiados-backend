import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryCustomerDto {
  @ApiPropertyOptional({
    description:
      'Texto libre: busca en nombre, apellido, documento, email o teléfono',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'] as const)
  status?: 'ACTIVE' | 'INACTIVE';

  @ApiPropertyOptional({ example: 'createdAt:DESC' })
  @IsOptional()
  @IsString()
  order?: string; // campo:ASC|DESC

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsNumberString()
  take?: number;

  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @IsNumberString()
  skip?: number;
}
