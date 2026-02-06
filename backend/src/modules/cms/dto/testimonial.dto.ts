import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({ description: 'Nome do cliente' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Cargo/Função do cliente' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ description: 'Empresa do cliente' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ description: 'Conteúdo do depoimento' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Avaliação (1-5)', default: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ description: 'URL da foto do cliente' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Se o depoimento está ativo', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateTestimonialDto {
  @ApiPropertyOptional({ description: 'Nome do cliente' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Cargo/Função do cliente' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ description: 'Empresa do cliente' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ description: 'Conteúdo do depoimento' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Avaliação (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ description: 'URL da foto do cliente' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Se o depoimento está ativo' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
