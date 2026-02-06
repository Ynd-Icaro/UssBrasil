import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public, CurrentUser, Roles } from '@/common/decorators';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma avaliação' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Você já avaliou este produto' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'Listar avaliações de um produto' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de avaliações do produto' })
  async findByProduct(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findByProduct(
      productId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Public()
  @Get('product/:productId/stats')
  @ApiOperation({ summary: 'Estatísticas de avaliações de um produto' })
  @ApiResponse({ status: 200, description: 'Estatísticas do produto' })
  async getProductStats(@Param('productId') productId: string) {
    return this.reviewsService.getProductStats(productId);
  }

  @Get('my-reviews')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar minhas avaliações' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de avaliações do usuário' })
  async findUserReviews(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findUserReviews(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get()
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as avaliações (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isApproved', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de todas as avaliações' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isApproved') isApproved?: string,
  ) {
    return this.reviewsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      isApproved !== undefined ? isApproved === 'true' : undefined,
    );
  }

  @Get('pending-count')
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Contar avaliações pendentes (Admin)' })
  @ApiResponse({ status: 200, description: 'Contagem de avaliações pendentes' })
  async getPendingCount() {
    return this.reviewsService.getPendingCount();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar avaliação por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes da avaliação' })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const isAdmin = ['ADMIN', 'GERENTE'].includes(role);
    return this.reviewsService.update(id, userId, updateReviewDto, isAdmin);
  }

  @Patch(':id/approve')
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aprovar avaliação (Admin)' })
  @ApiResponse({ status: 200, description: 'Avaliação aprovada' })
  async approve(@Param('id') id: string) {
    return this.reviewsService.approve(id);
  }

  @Patch(':id/reject')
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rejeitar avaliação (Admin)' })
  @ApiResponse({ status: 200, description: 'Avaliação rejeitada' })
  async reject(@Param('id') id: string) {
    return this.reviewsService.reject(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação excluída' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    const isAdmin = ['ADMIN', 'GERENTE'].includes(role);
    return this.reviewsService.delete(id, userId, isAdmin);
  }
}
