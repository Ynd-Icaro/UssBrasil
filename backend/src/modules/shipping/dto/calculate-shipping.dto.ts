import { IsString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingItemDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantidade' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CalculateShippingDto {
  @ApiProperty({ example: '88801505', description: 'CEP de destino' })
  @IsString()
  zipCode: string;

  @ApiProperty({ type: [ShippingItemDto], description: 'Itens do carrinho' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShippingItemDto)
  items: ShippingItemDto[];
}
