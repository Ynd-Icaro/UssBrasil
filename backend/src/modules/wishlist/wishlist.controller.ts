import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { CurrentUser } from '@/common/decorators';

@ApiTags('wishlist')
@Controller('wishlist')
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar produto à lista de desejos' })
  @ApiResponse({ status: 201, description: 'Produto adicionado' })
  @ApiResponse({ status: 409, description: 'Produto já está na lista' })
  async add(
    @CurrentUser('id') userId: string,
    @Body() addToWishlistDto: AddToWishlistDto,
  ) {
    return this.wishlistService.add(userId, addToWishlistDto);
  }

  @Post('toggle/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alternar produto na lista de desejos' })
  @ApiResponse({ status: 200, description: 'Status alterado' })
  async toggle(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.toggle(userId, productId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos da lista de desejos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de desejos' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.wishlistService.findAll(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Contar itens na lista de desejos' })
  @ApiResponse({ status: 200, description: 'Contagem de itens' })
  async getCount(@CurrentUser('id') userId: string) {
    return this.wishlistService.getCount(userId);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Verificar se produto está na lista de desejos' })
  @ApiResponse({ status: 200, description: 'Status do produto' })
  async check(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.check(userId, productId);
  }

  @Post('check-many')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar múltiplos produtos na lista de desejos' })
  @ApiResponse({ status: 200, description: 'Status dos produtos' })
  async checkMany(
    @CurrentUser('id') userId: string,
    @Body() body: { productIds: string[] },
  ) {
    return this.wishlistService.checkMany(userId, body.productIds);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover produto da lista de desejos' })
  @ApiResponse({ status: 200, description: 'Produto removido' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.remove(userId, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Limpar lista de desejos' })
  @ApiResponse({ status: 200, description: 'Lista limpa' })
  async clear(@CurrentUser('id') userId: string) {
    return this.wishlistService.clear(userId);
  }
}
