'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Percent, 
  ChevronRight, 
  Clock,
  Tag,
  ArrowRight,
  Gift,
  Sparkles,
  Flame,
  Calendar
} from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  discountValue: number;
  minPurchase?: number;
  code?: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function PromocoesPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions?active=true`);
        if (response.ok) {
          const data = await response.json();
          setPromotions(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error('Erro ao buscar promoções:', error);
        // Mock data para demonstração
        setPromotions([
          {
            id: '1',
            title: 'Black Friday Antecipada',
            description: 'Descontos imperdíveis em toda a linha de smartphones e acessórios. Aproveite!',
            discountType: 'PERCENTAGE',
            discountValue: 30,
            minPurchase: 200,
            imageUrl: '/images/promotions/black-friday.jpg',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          },
          {
            id: '2',
            title: 'Frete Grátis para Todo Brasil',
            description: 'Nas compras acima de R$ 199, o frete é por nossa conta para qualquer lugar do Brasil.',
            discountType: 'FREE_SHIPPING',
            discountValue: 0,
            minPurchase: 199,
            imageUrl: '/images/promotions/frete-gratis.jpg',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          },
          {
            id: '3',
            title: 'Combo WavePro',
            description: 'Leve 3 películas WavePro e ganhe 20% de desconto na compra. Proteção premium com economia!',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            code: 'WAVEPRO20',
            imageUrl: '/images/promotions/wavepro-combo.jpg',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Encerrada';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} dias restantes`;
    return `${hours} horas restantes`;
  };

  const getDiscountLabel = (promotion: Promotion) => {
    switch (promotion.discountType) {
      case 'PERCENTAGE':
        return `${promotion.discountValue}% OFF`;
      case 'FIXED':
        return `R$ ${promotion.discountValue} OFF`;
      case 'FREE_SHIPPING':
        return 'FRETE GRÁTIS';
      default:
        return 'PROMOÇÃO';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-500/10 via-background to-orange-500/5 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <Flame className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-500 font-medium">Ofertas Especiais</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Promoções{' '}
              <span className="text-red-500">Imperdíveis</span>
            </h1>
            
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Aproveite as melhores ofertas em produtos de tecnologia. 
              Descontos exclusivos por tempo limitado!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
              Início
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-foreground font-medium">Promoções</span>
          </nav>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Percent, label: 'Até', value: '50% OFF' },
              { icon: Gift, label: 'Cupons', value: 'Ativos' },
              { icon: Sparkles, label: 'Ofertas', value: 'Diárias' },
              { icon: Clock, label: 'Tempo', value: 'Limitado' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-card rounded-xl border border-border"
              >
                <stat.icon className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-text-muted">{stat.label}</p>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-surface" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-surface rounded w-3/4" />
                    <div className="h-4 bg-surface rounded w-full" />
                    <div className="h-10 bg-surface rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {promotions.map((promotion) => (
                <motion.div 
                  key={promotion.id} 
                  variants={itemVariants}
                  className="group"
                >
                  <div className="h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-red-500/30 transition-all duration-500">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {promotion.imageUrl ? (
                        <Image
                          src={promotion.imageUrl}
                          alt={promotion.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-orange-500/10 flex items-center justify-center">
                          <Percent className="w-16 h-16 text-red-500/30" />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                          {getDiscountLabel(promotion)}
                        </span>
                      </div>

                      {/* Time Badge */}
                      <div className="absolute bottom-4 right-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
                          <Clock className="w-3 h-3" />
                          {getTimeRemaining(promotion.endDate)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-red-500 transition-colors">
                        {promotion.title}
                      </h3>
                      
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {promotion.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        {promotion.minPurchase && (
                          <p className="text-xs text-text-muted flex items-center gap-2">
                            <Tag className="w-3 h-3" />
                            Compra mínima: R$ {promotion.minPurchase.toFixed(2)}
                          </p>
                        )}
                        <p className="text-xs text-text-muted flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          Válido até {formatDate(promotion.endDate)}
                        </p>
                      </div>

                      {/* Code or CTA */}
                      {promotion.code ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-4 py-3 bg-surface border-2 border-dashed border-red-500/30 rounded-xl text-center">
                            <p className="text-xs text-text-muted mb-1">Use o cupom:</p>
                            <p className="text-lg font-bold text-red-500">{promotion.code}</p>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href="/products"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                        >
                          Aproveitar Oferta
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && promotions.length === 0 && (
            <div className="text-center py-20">
              <Percent className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma promoção ativa no momento
              </h3>
              <p className="text-text-secondary mb-6">
                Fique de olho! Novas promoções são lançadas frequentemente.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Ver Todos os Produtos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Coupons CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Cupons de Desconto
            </h2>
            <p className="text-text-secondary mb-8">
              Confira todos os cupons disponíveis e economize ainda mais nas suas compras.
            </p>
            <Link
              href="/cupons"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Ver Cupons Disponíveis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
