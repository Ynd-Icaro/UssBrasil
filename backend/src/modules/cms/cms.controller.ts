import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { CreatePageContentDto, UpdatePageContentDto } from './dto/page-content.dto';
import { CreateHomeSectionDto, UpdateHomeSectionDto } from './dto/home-section.dto';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';
import { UpdateSiteConfigDto } from './dto/site-config.dto';

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // ==================== PUBLIC ENDPOINTS ====================

  @Public()
  @Get('home')
  @ApiOperation({ summary: 'Obter dados completos da página inicial' })
  getHomePageData() {
    return this.cmsService.getHomePageData();
  }

  @Public()
  @Get('hero-slides/public')
  @ApiOperation({ summary: 'Obter slides ativos do Hero Section' })
  getPublicHeroSlides() {
    return this.cmsService.getAllHeroSlides(false);
  }

  @Public()
  @Get('banners/public')
  @ApiOperation({ summary: 'Obter banners ativos' })
  @ApiQuery({ name: 'position', required: false })
  getPublicBanners(@Query('position') position?: string) {
    return this.cmsService.getAllBanners(position, false);
  }

  @Public()
  @Get('page/:slug')
  @ApiOperation({ summary: 'Obter conteúdo de página por slug' })
  getPageContent(@Param('slug') slug: string) {
    return this.cmsService.getPageContentBySlug(slug);
  }

  @Public()
  @Get('testimonials/public')
  @ApiOperation({ summary: 'Obter depoimentos ativos' })
  getPublicTestimonials() {
    return this.cmsService.getAllTestimonials(false);
  }

  @Public()
  @Get('site-config')
  @ApiOperation({ summary: 'Obter configurações do site' })
  getSiteConfig() {
    return this.cmsService.getSiteConfig();
  }

  // ==================== ADMIN - HERO SLIDES ====================

  @Get('admin/hero-slides')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os slides (admin)' })
  @ApiQuery({ name: 'includeInactive', required: false })
  getAllHeroSlides(@Query('includeInactive') includeInactive?: string) {
    return this.cmsService.getAllHeroSlides(includeInactive === 'true');
  }

  @Get('admin/hero-slides/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter slide por ID' })
  getHeroSlide(@Param('id') id: string) {
    return this.cmsService.getHeroSlide(id);
  }

  @Post('admin/hero-slides')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo slide' })
  createHeroSlide(@Body() dto: CreateHeroSlideDto) {
    return this.cmsService.createHeroSlide(dto);
  }

  @Put('admin/hero-slides/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar slide' })
  updateHeroSlide(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto) {
    return this.cmsService.updateHeroSlide(id, dto);
  }

  @Delete('admin/hero-slides/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir slide' })
  deleteHeroSlide(@Param('id') id: string) {
    return this.cmsService.deleteHeroSlide(id);
  }

  @Put('admin/hero-slides/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reordenar slides' })
  reorderHeroSlides(@Body() body: { slides: { id: string; order: number }[] }) {
    return this.cmsService.reorderHeroSlides(body.slides);
  }

  // ==================== ADMIN - BANNERS ====================

  @Get('admin/banners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os banners (admin)' })
  @ApiQuery({ name: 'position', required: false })
  @ApiQuery({ name: 'includeInactive', required: false })
  getAllBanners(
    @Query('position') position?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.cmsService.getAllBanners(position, includeInactive === 'true');
  }

  @Get('admin/banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter banner por ID' })
  getBanner(@Param('id') id: string) {
    return this.cmsService.getBanner(id);
  }

  @Post('admin/banners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo banner' })
  createBanner(@Body() dto: CreateBannerDto) {
    return this.cmsService.createBanner(dto);
  }

  @Put('admin/banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar banner' })
  updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.cmsService.updateBanner(id, dto);
  }

  @Delete('admin/banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir banner' })
  deleteBanner(@Param('id') id: string) {
    return this.cmsService.deleteBanner(id);
  }

  // ==================== ADMIN - PAGE CONTENT ====================

  @Get('admin/pages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as páginas' })
  getAllPageContents() {
    return this.cmsService.getAllPageContents();
  }

  @Post('admin/pages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova página' })
  createPageContent(@Body() dto: CreatePageContentDto) {
    return this.cmsService.createPageContent(dto);
  }

  @Put('admin/pages/:slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar página' })
  updatePageContent(@Param('slug') slug: string, @Body() dto: UpdatePageContentDto) {
    return this.cmsService.updatePageContent(slug, dto);
  }

  @Delete('admin/pages/:slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir página' })
  deletePageContent(@Param('slug') slug: string) {
    return this.cmsService.deletePageContent(slug);
  }

  // ==================== ADMIN - HOME SECTIONS ====================

  @Get('admin/sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as seções da home' })
  @ApiQuery({ name: 'includeInactive', required: false })
  getAllHomeSections(@Query('includeInactive') includeInactive?: string) {
    return this.cmsService.getAllHomeSections(includeInactive === 'true');
  }

  @Get('admin/sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter seção por ID' })
  getHomeSection(@Param('id') id: string) {
    return this.cmsService.getHomeSection(id);
  }

  @Post('admin/sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova seção' })
  createHomeSection(@Body() dto: CreateHomeSectionDto) {
    return this.cmsService.createHomeSection(dto);
  }

  @Put('admin/sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar seção' })
  updateHomeSection(@Param('id') id: string, @Body() dto: UpdateHomeSectionDto) {
    return this.cmsService.updateHomeSection(id, dto);
  }

  @Delete('admin/sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir seção' })
  deleteHomeSection(@Param('id') id: string) {
    return this.cmsService.deleteHomeSection(id);
  }

  @Put('admin/sections/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reordenar seções' })
  reorderHomeSections(@Body() body: { sections: { id: string; order: number }[] }) {
    return this.cmsService.reorderHomeSections(body.sections);
  }

  // ==================== ADMIN - TESTIMONIALS ====================

  @Get('admin/testimonials')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os depoimentos' })
  @ApiQuery({ name: 'includeInactive', required: false })
  getAllTestimonials(@Query('includeInactive') includeInactive?: string) {
    return this.cmsService.getAllTestimonials(includeInactive === 'true');
  }

  @Get('admin/testimonials/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter depoimento por ID' })
  getTestimonial(@Param('id') id: string) {
    return this.cmsService.getTestimonial(id);
  }

  @Post('admin/testimonials')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo depoimento' })
  createTestimonial(@Body() dto: CreateTestimonialDto) {
    return this.cmsService.createTestimonial(dto);
  }

  @Put('admin/testimonials/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar depoimento' })
  updateTestimonial(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.cmsService.updateTestimonial(id, dto);
  }

  @Delete('admin/testimonials/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir depoimento' })
  deleteTestimonial(@Param('id') id: string) {
    return this.cmsService.deleteTestimonial(id);
  }

  // ==================== ADMIN - SITE CONFIG ====================

  @Put('admin/site-config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GERENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar configurações do site' })
  updateSiteConfig(@Body() dto: UpdateSiteConfigDto) {
    return this.cmsService.updateSiteConfig(dto);
  }
}
