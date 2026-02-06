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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Public, Roles } from '@/common/decorators';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar marcas' })
  @ApiResponse({ status: 200, description: 'Lista de marcas retornada com sucesso' })
  async findAll(@Query('includeInactive') includeInactive?: boolean) {
    return this.brandsService.findAll(includeInactive);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obter marca por slug' })
  @ApiResponse({ status: 200, description: 'Marca retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Marca não encontrada' })
  async findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obter marca por ID' })
  @ApiResponse({ status: 200, description: 'Marca retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Marca não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar marca (Admin)' })
  @ApiResponse({ status: 201, description: 'Marca criada com sucesso' })
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar marca (Admin)' })
  @ApiResponse({ status: 200, description: 'Marca atualizada com sucesso' })
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover marca (Admin)' })
  @ApiResponse({ status: 200, description: 'Marca removida com sucesso' })
  async delete(@Param('id') id: string) {
    return this.brandsService.delete(id);
  }
}
