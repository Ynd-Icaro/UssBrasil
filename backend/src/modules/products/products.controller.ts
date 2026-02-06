import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Public, Roles } from '@/common/decorators';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Listar produtos em destaque' })
  async getFeatured(@Query('limit') limit?: number) {
    return this.productsService.getFeatured(limit);
  }

  @Public()
  @Get('new')
  @ApiOperation({ summary: 'Listar novos produtos' })
  async getNew(@Query('limit') limit?: number) {
    return this.productsService.getNew(limit);
  }

  @Public()
  @Get('best-sellers')
  @ApiOperation({ summary: 'Listar produtos mais vendidos' })
  async getBestSellers(@Query('limit') limit?: number) {
    return this.productsService.getBestSellers(limit);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obter produto por slug' })
  @ApiResponse({ status: 200, description: 'Produto retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obter produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Obter produtos relacionados' })
  async findRelated(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.productsService.findRelated(id, limit);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar produto (Admin)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto (Admin)' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover produto (Admin)' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ativar/desativar produto (Admin)' })
  async toggleActive(@Param('id') id: string) {
    return this.productsService.toggleActive(id);
  }

  @Patch(':id/stock')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar estoque (Admin)' })
  async updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.updateStock(id, quantity);
  }

  // ===================== VARIANTS ENDPOINTS =====================

  @Post(':id/variants')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar variação ao produto (Admin)' })
  @ApiResponse({ status: 201, description: 'Variação criada com sucesso' })
  async addVariant(
    @Param('id') id: string,
    @Body() variantData: {
      name: string;
      sku?: string;
      ncm?: string;
      options?: Record<string, string>;
      price?: number;
      priceAdjustment?: number;
      stock?: number;
      image?: string;
      serialNumbers?: string[];
    },
  ) {
    return this.productsService.addVariant(id, variantData);
  }

  @Patch('variants/:variantId/stock')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar estoque de variação (Admin)' })
  async updateVariantStock(
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateVariantStock(variantId, quantity);
  }

  @Post('variants/:variantId/serial-numbers')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar número de série a variação (Admin)' })
  async addSerialNumber(
    @Param('variantId') variantId: string,
    @Body('serialNumber') serialNumber: string,
  ) {
    return this.productsService.addSerialNumber(variantId, serialNumber);
  }

  @Delete('variants/:variantId/serial-numbers/:serialNumber')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover número de série de variação (Admin)' })
  async removeSerialNumber(
    @Param('variantId') variantId: string,
    @Param('serialNumber') serialNumber: string,
  ) {
    return this.productsService.removeSerialNumber(variantId, serialNumber);
  }
}
