import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { CreatePageContentDto, UpdatePageContentDto } from './dto/page-content.dto';
import { CreateHomeSectionDto, UpdateHomeSectionDto } from './dto/home-section.dto';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';
import { UpdateSiteConfigDto } from './dto/site-config.dto';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // ==================== HERO SLIDES ====================
  
  async getAllHeroSlides(includeInactive = false) {
    return this.prisma.heroSlide.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getHeroSlide(id: string) {
    const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) {
      throw new NotFoundException('Slide não encontrado');
    }
    return slide;
  }

  async createHeroSlide(dto: CreateHeroSlideDto) {
    return this.prisma.heroSlide.create({
      data: dto,
    });
  }

  async updateHeroSlide(id: string, dto: UpdateHeroSlideDto) {
    await this.getHeroSlide(id);
    return this.prisma.heroSlide.update({
      where: { id },
      data: dto,
    });
  }

  async deleteHeroSlide(id: string) {
    await this.getHeroSlide(id);
    return this.prisma.heroSlide.delete({ where: { id } });
  }

  async reorderHeroSlides(slidesOrder: { id: string; order: number }[]) {
    const updates = slidesOrder.map(({ id, order }) =>
      this.prisma.heroSlide.update({
        where: { id },
        data: { order },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }

  // ==================== BANNERS ====================
  
  async getAllBanners(position?: string, includeInactive = false) {
    const now = new Date();
    return this.prisma.banner.findMany({
      where: {
        ...(position && { position }),
        ...(includeInactive ? {} : { 
          isActive: true,
          OR: [
            { startDate: null, endDate: null },
            { startDate: { lte: now }, endDate: { gte: now } },
            { startDate: { lte: now }, endDate: null },
            { startDate: null, endDate: { gte: now } },
          ],
        }),
      },
      orderBy: { order: 'asc' },
    });
  }

  async getBanner(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException('Banner não encontrado');
    }
    return banner;
  }

  async createBanner(dto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: dto,
    });
  }

  async updateBanner(id: string, dto: UpdateBannerDto) {
    await this.getBanner(id);
    return this.prisma.banner.update({
      where: { id },
      data: dto,
    });
  }

  async deleteBanner(id: string) {
    await this.getBanner(id);
    return this.prisma.banner.delete({ where: { id } });
  }

  // ==================== PAGE CONTENT ====================
  
  async getAllPageContents() {
    return this.prisma.pageContent.findMany({
      orderBy: { slug: 'asc' },
    });
  }

  async getPageContentBySlug(slug: string) {
    const content = await this.prisma.pageContent.findUnique({
      where: { slug },
    });
    if (!content) {
      throw new NotFoundException('Página não encontrada');
    }
    return content;
  }

  async createPageContent(dto: CreatePageContentDto) {
    return this.prisma.pageContent.create({
      data: dto,
    });
  }

  async updatePageContent(slug: string, dto: UpdatePageContentDto) {
    await this.getPageContentBySlug(slug);
    return this.prisma.pageContent.update({
      where: { slug },
      data: dto,
    });
  }

  async deletePageContent(slug: string) {
    await this.getPageContentBySlug(slug);
    return this.prisma.pageContent.delete({ where: { slug } });
  }

  // ==================== HOME SECTIONS ====================
  
  async getAllHomeSections(includeInactive = false) {
    return this.prisma.homeSection.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getHomeSection(id: string) {
    const section = await this.prisma.homeSection.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundException('Seção não encontrada');
    }
    return section;
  }

  async createHomeSection(dto: CreateHomeSectionDto) {
    return this.prisma.homeSection.create({
      data: dto,
    });
  }

  async updateHomeSection(id: string, dto: UpdateHomeSectionDto) {
    await this.getHomeSection(id);
    return this.prisma.homeSection.update({
      where: { id },
      data: dto,
    });
  }

  async deleteHomeSection(id: string) {
    await this.getHomeSection(id);
    return this.prisma.homeSection.delete({ where: { id } });
  }

  async reorderHomeSections(sectionsOrder: { id: string; order: number }[]) {
    const updates = sectionsOrder.map(({ id, order }) =>
      this.prisma.homeSection.update({
        where: { id },
        data: { order },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }

  // ==================== TESTIMONIALS ====================
  
  async getAllTestimonials(includeInactive = false) {
    return this.prisma.testimonial.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTestimonial(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      throw new NotFoundException('Depoimento não encontrado');
    }
    return testimonial;
  }

  async createTestimonial(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: dto,
    });
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    await this.getTestimonial(id);
    return this.prisma.testimonial.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTestimonial(id: string) {
    await this.getTestimonial(id);
    return this.prisma.testimonial.delete({ where: { id } });
  }

  // ==================== SITE CONFIG ====================
  
  async getSiteConfig() {
    let config = await this.prisma.siteConfig.findFirst();
    
    // Se não existir, criar configuração padrão
    if (!config) {
      config = await this.prisma.siteConfig.create({
        data: {
          heroTitle: 'WavePro Tecnologia',
          heroSubtitle: 'A melhor empresa de revenda de tecnologia do país',
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          accentColor: '#F59E0B',
        },
      });
    }
    
    return config;
  }

  async updateSiteConfig(dto: UpdateSiteConfigDto) {
    const config = await this.getSiteConfig();
    return this.prisma.siteConfig.update({
      where: { id: config.id },
      data: dto,
    });
  }

  // ==================== HOME PAGE DATA (PUBLIC) ====================
  
  async getHomePageData() {
    const [heroSlides, banners, sections, testimonials, siteConfig] = await Promise.all([
      this.getAllHeroSlides(),
      this.getAllBanners(),
      this.getAllHomeSections(),
      this.getAllTestimonials(),
      this.getSiteConfig(),
    ]);

    return {
      heroSlides,
      banners: {
        top: banners.filter((b) => b.position === 'home-top'),
        middle: banners.filter((b) => b.position === 'home-middle'),
        sidebar: banners.filter((b) => b.position === 'sidebar'),
        footer: banners.filter((b) => b.position === 'footer'),
      },
      sections,
      testimonials,
      siteConfig,
    };
  }
}
