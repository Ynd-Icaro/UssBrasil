import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePageContentDto {
  @ApiProperty({ description: 'Slug da página (URL amigável)', example: 'about' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Título da página' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Conteúdo da página (HTML ou Markdown)' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Meta título para SEO' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta descrição para SEO' })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Se a página está publicada', default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdatePageContentDto {
  @ApiPropertyOptional({ description: 'Título da página' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Conteúdo da página (HTML ou Markdown)' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Meta título para SEO' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta descrição para SEO' })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Se a página está publicada' })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
