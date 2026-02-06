'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Percent, Flame, ArrowRight, Zap, Tag } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  discount?: number;
  link?: string;
  endsAt?: string;
  color?: string;
}

interface PromotionsSectionProps {
  promotions?: Promotion[];
  isLoading?: boolean;
}

const defaultPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Flash Sale',
    subtitle: 'Até 50% OFF',
    description: 'Películas WavePro com desconto especial. Proteção premium pelo menor preço!',
    discount: 50,
    link: '/products?promo=flash-sale',
    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    color: 'from-red-500 to-orange-500',
  },
  {
    id: '2',
    title: 'Combo iPhone',
    subtitle: 'Economize R$ 100',
    description: 'Capinha + Película + Carregador com super desconto. Aproveite!',
    discount: 30,
    link: '/products?promo=combo-iphone',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '3',
    title: 'Semana Samsung',
    subtitle: 'Acessórios Originais',
    description: 'Toda linha de acessórios Galaxy com preços especiais.',
    discount: 25,
    link: '/products?brand=samsung',
    color: 'from-purple-500 to-pink-500',
  },
];

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endsAt).getTime() - Date.now();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4" />
      <div className="flex gap-1 font-mono text-sm">
        <span className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span>:</span>
        <span className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span>:</span>
        <span className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

export default function PromotionsSection({ promotions, isLoading = false }: PromotionsSectionProps) {
  const displayPromotions = promotions && promotions.length > 0 ? promotions : defaultPromotions;

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-border/50 rounded w-48 mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-border/30 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span className="text-red-500 text-sm font-semibold uppercase tracking-wider">
                Ofertas Imperdíveis
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Promoções da Semana
            </h2>
          </div>
          <Link href="/promocoes">
            <motion.button
              whileHover={{ x: 5 }}
              className="text-primary font-medium flex items-center gap-2"
            >
              Ver todas as ofertas
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {displayPromotions.slice(0, 3).map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={promo.link || '/promocoes'}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.color || 'from-primary to-amber-600'} p-6 h-64 text-white`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,white_0%,transparent_50%)]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                  </div>

                  {/* Discount Badge */}
                  {promo.discount && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Tag className="w-4 h-4" />
                      <span className="font-bold text-sm">-{promo.discount}%</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex-1">
                      <p className="text-white/80 text-sm font-medium mb-1">{promo.subtitle}</p>
                      <h3 className="text-2xl font-bold mb-3">{promo.title}</h3>
                      <p className="text-white/90 text-sm line-clamp-2">{promo.description}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4">
                      {promo.endsAt ? (
                        <CountdownTimer endsAt={promo.endsAt} />
                      ) : (
                        <span className="text-sm text-white/80">Oferta limitada</span>
                      )}
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Link href="/cupons">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-card via-surface to-card border border-border p-6 md:p-8"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(234,179,8,0.1)_0%,transparent_50%,rgba(234,179,8,0.1)_100%)]" />
              
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Cupons de Desconto</h3>
                    <p className="text-text-secondary">Use o código <span className="text-primary font-mono font-bold">BEMVINDO10</span> e ganhe 10% OFF na primeira compra</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary text-background font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap"
                >
                  Ver Cupons
                  <Percent className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
