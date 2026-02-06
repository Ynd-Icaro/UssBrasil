import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateCouponDto {
  @ApiProperty({ example: 'DESCONTO10', description: 'Código do cupom' })
  @IsString()
  code: string;

  @ApiProperty({ example: 199.90, description: 'Valor total do carrinho' })
  @IsNumber()
  @Min(0)
  cartTotal: number;
}
