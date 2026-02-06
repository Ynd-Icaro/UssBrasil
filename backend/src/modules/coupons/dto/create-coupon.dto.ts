import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsDateString, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateCouponDto {
  @ApiProperty({ example: 'DESCONTO10', description: 'Código do cupom' })
  @IsString()
  @MinLength(3, { message: 'O código deve ter pelo menos 3 caracteres' })
  @MaxLength(30, { message: 'O código deve ter no máximo 30 caracteres' })
  code: string;

  @ApiPropertyOptional({ example: '10% de desconto em qualquer compra', description: 'Descrição do cupom' })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'A descrição deve ter no máximo 200 caracteres' })
  description?: string;

  @ApiProperty({ enum: DiscountType, example: 'PERCENTAGE', description: 'Tipo do desconto' })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ example: 10, description: 'Valor do desconto (% ou R$)', minimum: 0.01 })
  @IsNumber()
  @Min(0.01, { message: 'O valor do desconto deve ser maior que 0' })
  discountValue: number;

  @ApiPropertyOptional({ example: 100, description: 'Valor mínimo do pedido para usar o cupom' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderValue?: number;

  @ApiPropertyOptional({ example: 50, description: 'Desconto máximo (para cupons de %)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @ApiPropertyOptional({ example: 100, description: 'Limite de usos total' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({ example: true, description: 'Se o cupom está ativo' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00Z', description: 'Data de início da validade' })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59Z', description: 'Data de expiração' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
