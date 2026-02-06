import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ShippingService } from './shipping.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';
import { Public } from '@/common/decorators';

@ApiTags('shipping')
@Controller('shipping')
@Public()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calcular opções de frete' })
  @ApiResponse({ status: 200, description: 'Opções de frete calculadas' })
  @ApiResponse({ status: 400, description: 'CEP inválido' })
  async calculate(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.shippingService.calculate(calculateShippingDto);
  }

  @Get('zipcode/:zipCode')
  @ApiOperation({ summary: 'Consultar endereço por CEP' })
  @ApiResponse({ status: 200, description: 'Endereço encontrado' })
  @ApiResponse({ status: 400, description: 'CEP inválido ou não encontrado' })
  async getAddressByZipCode(@Param('zipCode') zipCode: string) {
    return this.shippingService.getAddressByZipCode(zipCode);
  }
}
