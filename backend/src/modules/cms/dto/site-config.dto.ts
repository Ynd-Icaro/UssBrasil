import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSiteConfigDto {
  @ApiPropertyOptional({ description: 'URL do logo principal' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'URL do logo branco (para fundos escuros)' })
  @IsString()
  @IsOptional()
  logoWhiteUrl?: string;

  @ApiPropertyOptional({ description: 'URL do favicon' })
  @IsString()
  @IsOptional()
  faviconUrl?: string;

  @ApiPropertyOptional({ description: 'Cor primária (hex)', example: '#3B82F6' })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional({ description: 'Cor secundária (hex)', example: '#10B981' })
  @IsString()
  @IsOptional()
  secondaryColor?: string;

  @ApiPropertyOptional({ description: 'Cor de destaque (hex)', example: '#F59E0B' })
  @IsString()
  @IsOptional()
  accentColor?: string;

  @ApiPropertyOptional({ description: 'Título do Hero Section' })
  @IsString()
  @IsOptional()
  heroTitle?: string;

  @ApiPropertyOptional({ description: 'Subtítulo do Hero Section' })
  @IsString()
  @IsOptional()
  heroSubtitle?: string;

  @ApiPropertyOptional({ description: 'Texto do rodapé' })
  @IsString()
  @IsOptional()
  footerText?: string;

  @ApiPropertyOptional({ description: 'Link do Facebook' })
  @IsString()
  @IsOptional()
  socialFacebook?: string;

  @ApiPropertyOptional({ description: 'Link do Instagram' })
  @IsString()
  @IsOptional()
  socialInstagram?: string;

  @ApiPropertyOptional({ description: 'Link do Twitter' })
  @IsString()
  @IsOptional()
  socialTwitter?: string;

  @ApiPropertyOptional({ description: 'Link do LinkedIn' })
  @IsString()
  @IsOptional()
  socialLinkedin?: string;

  @ApiPropertyOptional({ description: 'Link do YouTube' })
  @IsString()
  @IsOptional()
  socialYoutube?: string;

  @ApiPropertyOptional({ description: 'Número do WhatsApp' })
  @IsString()
  @IsOptional()
  whatsappNumber?: string;
}
