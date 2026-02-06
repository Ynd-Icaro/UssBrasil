'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, Sparkles, Store, Users, Heart } from 'lucide-react';
import { ProductGrid } from '@/components/products';
import api from '@/lib/api';
import { Product, Brand } from '@/types';

// Import all home components
import {
  HeroSection,
  FeaturesSection,
  WaveProBanner,
  WelcomeBanner,
  BrandsSection,
  NewsletterSection,
  TestimonialsSection,
  CategoriesShowcase,
  PromotionsSection,
  StatsSection,
  PaymentMethodsSection,
  HelpSection,
  BlogPreview,
} from '@/components/home';

// Types
interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

interface SiteConfig {
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  publishedAt: string;
  readTime: number;
}

interface Promotion {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  discount?: number;
  link?: string;
  endsAt?: string;
  color?: string;
}

interface CMSData {
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  siteConfig: SiteConfig;
  blogPosts?: BlogPost[];
  promotions?: Promotion[];
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cmsData, setCmsData] = useState<CMSData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          featuredRes, 
          newRes, 
          bestSellersRes,
          brandsRes, 
          categoriesRes,
          cmsRes
        ] = await Promise.all([
          api.get('/products/featured?limit=8'),
          api.get('/products/new?limit=8'),
          api.get('/products?orderBy=salesCount&limit=4').catch(() => ({ data: [] })),
          api.get('/brands'),
          api.get('/categories').catch(() => ({ data: [] })),
          api.get('/cms/home').catch(() => null),
        ]);

        // Handle both array response and { data: [...] } response
        const featuredData = Array.isArray(featuredRes.data) ? featuredRes.data : (featuredRes.data.data || []);
        const newData = Array.isArray(newRes.data) ? newRes.data : (newRes.data.data || []);
        const bestSellersData = Array.isArray(bestSellersRes.data) ? bestSellersRes.data : (bestSellersRes.data.data || []);
        const brandsData = Array.isArray(brandsRes.data) ? brandsRes.data : (brandsRes.data.data || []);
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data.data || []);

        setFeaturedProducts(featuredData);
        setNewProducts(newData);
        setBestSellers(bestSellersData);
        setBrands(brandsData);
        setCategories(categoriesData);
        
        if (cmsRes?.data) {
          setCmsData(cmsRes.data);
        }
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ==================== HERO SECTION ==================== */}
      <HeroSection 
        slides={cmsData?.heroSlides}
        siteConfig={cmsData?.siteConfig}
        isLoading={isLoading}
      />

      {/* ==================== BRANDS SECTION ==================== */}
      <BrandsSection brands={brands} isLoading={isLoading} />

      {/* ==================== FEATURES SECTION ==================== */}
      <FeaturesSection />

      {/* ==================== PROMOTIONS SECTION ==================== */}
      <PromotionsSection 
        promotions={cmsData?.promotions}
        isLoading={isLoading}
      />

      {/* ==================== WELCOME BANNER (USS BRASIL) ==================== */}
      <WelcomeBanner isLoading={isLoading} />

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                  Destaques
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Os mais procurados
              </h2>
              <p className="text-text-secondary mt-2">
                Produtos selecionados especialmente para você
              </p>
            </div>
            <Link href="/products?featured=true">
              <motion.button
                whileHover={{ x: 5 }}
                className="text-primary font-medium flex items-center gap-2 group"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* ==================== CATEGORIES SHOWCASE ==================== */}
      <CategoriesShowcase 
        categories={categories} 
        isLoading={isLoading} 
      />

      {/* ==================== WAVEPRO BANNER (Yellow/Black Theme) ==================== */}
      <WaveProBanner />

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <TestimonialsSection 
        testimonials={cmsData?.testimonials}
        isLoading={isLoading}
      />

      {/* ==================== NEW ARRIVALS ==================== */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-5 h-5 text-green-500" />
                <span className="text-green-500 text-sm font-semibold uppercase tracking-wider">
                  Novidades
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Acabaram de chegar
              </h2>
              <p className="text-text-secondary mt-2">
                Os lançamentos mais recentes das melhores marcas
              </p>
            </div>
            <Link href="/products?new=true">
              <motion.button
                whileHover={{ x: 5 }}
                className="text-primary font-medium flex items-center gap-2 group"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>

          <ProductGrid products={newProducts} isLoading={isLoading} columns={4} />
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <StatsSection />

      {/* ==================== BEST SELLERS ==================== */}
      {bestSellers.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 text-sm font-semibold uppercase tracking-wider">
                    Mais Vendidos
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Favoritos dos clientes
                </h2>
                <p className="text-text-secondary mt-2">
                  Os produtos que nossos clientes mais amam
                </p>
              </div>
              <Link href="/products?orderBy=bestselling">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-primary font-medium flex items-center gap-2 group"
                >
                  Ver todos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>

            <ProductGrid products={bestSellers} isLoading={isLoading} columns={4} />
          </div>
        </section>
      )}

      {/* ==================== BLOG PREVIEW ==================== */}
      <BlogPreview 
        posts={cmsData?.blogPosts}
        isLoading={isLoading}
      />

      {/* ==================== NEWSLETTER SECTION ==================== */}
      <NewsletterSection />

      {/* ==================== HELP SECTION ==================== */}
      <HelpSection />

      {/* ==================== PAYMENT METHODS ==================== */}
      <PaymentMethodsSection />

      {/* ==================== INSTAGRAM CTA ==================== */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Siga-nos no Instagram
            </h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Acompanhe as novidades, promoções exclusivas, bastidores e dicas de tecnologia
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://instagram.com/comercialussbrasil" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-background font-semibold rounded-xl shadow-lg shadow-primary/25"
                >
                  @comercialussbrasil
                </motion.button>
              </a>
              <a href="https://instagram.com/waveprotecnologia" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-card border border-border text-foreground font-semibold rounded-xl hover:border-primary/50 transition-colors"
                >
                  @waveprotecnologia
                </motion.button>
              </a>
              <a href="https://instagram.com/cricellimportsoficial" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-card border border-border text-foreground font-semibold rounded-xl hover:border-primary/50 transition-colors"
                >
                  @cricellimportsoficial
                </motion.button>
              </a>
            </div>

            {/* Instagram Feed Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-2 max-w-4xl mx-auto"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="aspect-square bg-gradient-to-br from-card to-surface rounded-lg border border-border flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== QUICK LINKS / FOOTER TOP ==================== */}
      <section className="py-12 bg-surface border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Link href="/lojas" className="group">
              <motion.div whileHover={{ y: -5 }} className="p-4">
                <Store className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Nossas Lojas
                </span>
              </motion.div>
            </Link>
            <Link href="/trabalhe-conosco" className="group">
              <motion.div whileHover={{ y: -5 }} className="p-4">
                <Users className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Trabalhe Conosco
                </span>
              </motion.div>
            </Link>
            <Link href="/faq" className="group">
              <motion.div whileHover={{ y: -5 }} className="p-4">
                <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">❓</span>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  FAQ
                </span>
              </motion.div>
            </Link>
            <Link href="/contato" className="group">
              <motion.div whileHover={{ y: -5 }} className="p-4">
                <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">💬</span>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Contato
                </span>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
