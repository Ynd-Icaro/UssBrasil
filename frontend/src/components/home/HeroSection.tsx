'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface SiteConfig {
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
}

interface HeroSectionProps {
  slides?: HeroSlide[];
  siteConfig?: SiteConfig;
  isLoading?: boolean;
}

// Slides padrão para quando não houver dados do CMS
const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'WavePro',
    subtitle: 'Tecnologia Premium',
    description: 'A melhor empresa de revenda de tecnologia do país. Produtos originais das melhores marcas do mundo com garantia e suporte especializado.',
    imageUrl: '/images/hero-bg-1.jpg',
    ctaText: 'Explorar Produtos',
    ctaLink: '/products',
    order: 0,
    isActive: true,
  },
  {
    id: '2',
    title: 'Proteção Máxima',
    subtitle: 'Linha WavePro',
    description: 'Películas premium com tecnologia de ponta. Máxima proteção e clareza cristalina para seu smartphone.',
    imageUrl: '/images/hero-bg-2.jpg',
    ctaText: 'Conhecer WavePro',
    ctaLink: '/wavepro',
    order: 1,
    isActive: true,
  },
  {
    id: '3',
    title: 'Acessórios Premium',
    subtitle: 'Qualidade Garantida',
    description: 'Os melhores acessórios das maiores marcas do mundo. Apple, Samsung, Xiaomi e muito mais.',
    imageUrl: '/images/hero-bg-3.jpg',
    ctaText: 'Ver Acessórios',
    ctaLink: '/categories/acessorios',
    order: 2,
    isActive: true,
  },
];

export default function HeroSection({ slides, siteConfig, isLoading = false }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const slide = activeSlides[currentSlide];

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            {slide.imageUrl && !slide.imageUrl.includes('hero-bg') ? (
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover opacity-30"
                priority
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Logo WavePro (Rounded) */}
      <div className="absolute top-1/2 right-8 md:right-20 -translate-y-1/2 hidden lg:flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-primary/20 rounded-[40px] blur-2xl scale-110" />
          
          {/* Logo container */}
          <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] bg-gradient-to-br from-card via-surface to-card rounded-[40px] border-2 border-primary/30 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Inner gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
            
            {/* Grid pattern inside */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            {/* Logo */}
            {siteConfig?.logoUrl ? (
              <Image
                src={siteConfig.logoUrl}
                alt="WavePro Logo"
                width={200}
                height={200}
                className="object-contain z-10"
              />
            ) : (
              <div className="z-10 text-center">
                <motion.div
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(234, 179, 8, 0.3)',
                      '0 0 40px rgba(234, 179, 8, 0.5)',
                      '0 0 20px rgba(234, 179, 8, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl md:text-6xl font-black"
                >
                  <span className="text-primary">WAVE</span>
                  <span className="text-foreground">PRO</span>
                </motion.div>
                <p className="text-text-muted text-sm mt-2 font-medium tracking-wider">TECNOLOGIA PREMIUM</p>
              </div>
            )}

            {/* Animated border gradient */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-[40px] border-2 border-transparent"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.3), transparent) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-2xl backdrop-blur-sm border border-primary/30"
          />
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 w-12 h-12 bg-primary/10 rounded-xl backdrop-blur-sm border border-primary/20"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">
                  {slide.subtitle || 'WavePro Tecnologia'}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-[0.95]"
              >
                <span className="text-foreground">{slide.title}</span>
                {slide.subtitle && (
                  <>
                    <br />
                    <span className="text-primary">{slide.subtitle}</span>
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed"
              >
                {slide.description || siteConfig?.heroSubtitle || 'A melhor empresa de revenda de tecnologia do país'}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {slide.ctaLink && slide.ctaText && (
                  <Link href={slide.ctaLink}>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(234, 179, 8, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-primary text-black font-bold rounded-xl flex items-center gap-2 shadow-glow transition-all duration-300"
                    >
                      {slide.ctaText}
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                )}
                <Link href="/categories">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-surface border border-border text-foreground font-medium rounded-xl hover:border-primary/50 transition-all duration-300"
                  >
                    Ver Categorias
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="flex items-center gap-4 mt-12">
            {/* Prev/Next buttons */}
            <button
              onClick={goToPrev}
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex gap-2">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-12 bg-primary' 
                      : 'w-6 bg-border hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-12 mt-16 pt-8 border-t border-border/50"
          >
            {[
              { value: '15+', label: 'Anos de Mercado' },
              { value: '50k+', label: 'Clientes Satisfeitos' },
              { value: '10k+', label: 'Produtos' },
              { value: '4.9', label: 'Avaliação Média' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="hidden md:block"
              >
                <span className="text-3xl font-bold text-primary">{stat.value}</span>
                <p className="text-text-muted text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-border rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
