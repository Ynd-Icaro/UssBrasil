import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ description: 'Título do banner' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'URL da imagem do banner' })
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional({ description: 'URL da imagem para mobile' })
  @IsString()
  @IsOptional()
  mobileImageUrl?: string;

  @ApiPropertyOptional({ description: 'Link de destino do banner' })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ 
    description: 'Posição do banner', 
    enum: ['home-top', 'home-middle', 'sidebar', 'footer'] 
  })
  @IsString()
  position: string;

  @ApiPropertyOptional({ description: 'Ordem de exibição', default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Se o banner está ativo', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Data de início da exibição' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data de fim da exibição' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class UpdateBannerDto {
  @ApiPropertyOptional({ description: 'Título do banner' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'URL da imagem do banner' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'URL da imagem para mobile' })
  @IsString()
  @IsOptional()
  mobileImageUrl?: string;

  @ApiPropertyOptional({ description: 'Link de destino do banner' })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({ 
    description: 'Posição do banner', 
    enum: ['home-top', 'home-middle', 'sidebar', 'footer'] 
  })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: 'Ordem de exibição' })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ description: 'Se o banner está ativo' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Data de início da exibição' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data de fim da exibição' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
