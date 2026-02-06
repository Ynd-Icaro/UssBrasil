import { IsString, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHomeSectionDto {
  @ApiProperty({ 
    description: 'Tipo da seção', 
    enum: ['featured-products', 'categories', 'testimonials', 'brands', 'features', 'newsletter', 'custom'] 
  })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Título da seção' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Subtítulo da seção' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Ordem de exibição', default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Se a seção está ativa', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Configurações específicas da seção (JSON)' })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}

export class UpdateHomeSectionDto {
  @ApiPropertyOptional({ 
    description: 'Tipo da seção', 
    enum: ['featured-products', 'categories', 'testimonials', 'brands', 'features', 'newsletter', 'custom'] 
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Título da seção' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Subtítulo da seção' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Ordem de exibição' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Se a seção está ativa' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Configurações específicas da seção (JSON)' })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}
