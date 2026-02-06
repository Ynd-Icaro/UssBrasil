import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHeroSlideDto {
  @ApiProperty({ description: 'Título do slide' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Subtítulo do slide' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Descrição do slide' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'URL da imagem do slide' })
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional({ description: 'URL da imagem para mobile' })
  @IsString()
  @IsOptional()
  mobileImageUrl?: string;

  @ApiPropertyOptional({ description: 'Texto do botão de ação (CTA)' })
  @IsString()
  @IsOptional()
  ctaText?: string;

  @ApiPropertyOptional({ description: 'Link do botão de ação' })
  @IsString()
  @IsOptional()
  ctaLink?: string;

  @ApiPropertyOptional({ description: 'Ordem de exibição', default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Se o slide está ativo', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateHeroSlideDto {
  @ApiPropertyOptional({ description: 'Título do slide' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Subtítulo do slide' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Descrição do slide' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'URL da imagem do slide' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'URL da imagem para mobile' })
  @IsString()
  @IsOptional()
  mobileImageUrl?: string;

  @ApiPropertyOptional({ description: 'Texto do botão de ação (CTA)' })
  @IsString()
  @IsOptional()
  ctaText?: string;

  @ApiPropertyOptional({ description: 'Link do botão de ação' })
  @IsString()
  @IsOptional()
  ctaLink?: string;

  @ApiPropertyOptional({ description: 'Ordem de exibição' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Se o slide está ativo' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
