import { IsString, IsInt, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 5, description: 'Nota de 1 a 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1, { message: 'A nota mínima é 1' })
  @Max(5, { message: 'A nota máxima é 5' })
  rating: number;

  @ApiPropertyOptional({ example: 'Excelente produto!', description: 'Título da avaliação' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'O título deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O título deve ter no máximo 100 caracteres' })
  title?: string;

  @ApiPropertyOptional({ example: 'Produto de ótima qualidade...', description: 'Comentário da avaliação' })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'O comentário deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, { message: 'O comentário deve ter no máximo 1000 caracteres' })
  comment?: string;
}
