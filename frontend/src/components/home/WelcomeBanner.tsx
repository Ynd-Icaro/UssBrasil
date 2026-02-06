'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package, Truck, Shield, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface CMSBannerData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  features?: string[];
}

interface WelcomeBannerProps {
  bannerData?: CMSBannerData;
  isLoading?: boolean;
}

// Dados padrão quando não houver dados do CMS
const defaultBannerData: CMSBannerData = {
  id: 'default',
  title: 'Bem-vindo à USS Brasil',
  subtitle: 'Mais de 15 anos de tradição em tecnologia',
  description: 'A maior distribuidora de acessórios e tecnologia do Sul do Brasil. Produtos originais das melhores marcas, com garantia e o melhor atendimento.',
  ctaText: 'Conheça Nossos Produtos',
  ctaLink: '/products',
  features: [
    'Mais de 15.000 produtos em estoque',
    'Entrega para todo Brasil',
    'Atendimento especializado',
    'Garantia em todos os produtos',
  ],
};

const highlights = [
  { icon: Package, label: '15.000+ Produtos', color: 'text-blue-500' },
  { icon: Truck, label: 'Entrega Rápida', color: 'text-green-500' },
  { icon: Shield, label: 'Garantia Total', color: 'text-purple-500' },
  { icon: Award, label: '15 Anos', color: 'text-primary' },
];

export default function WelcomeBanner({ bannerData, isLoading = false }: WelcomeBannerProps) {
  const data = bannerData || defaultBannerData;

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse rounded-3xl bg-border/30 h-[400px]" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-card to-primary/10 border border-blue-500/20"
        >
          {/* Background patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            {/* Top highlights */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border"
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Main content */}
            <div className="text-center max-w-4xl mx-auto">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-blue-500 text-sm font-semibold uppercase tracking-wider mb-4"
              >
                {data.subtitle}
              </motion.span>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-black mb-6"
              >
                <span className="text-foreground">Bem-vindo à </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-primary">USS Brasil</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto"
              >
                {data.description}
              </motion.p>

              {/* Features grid */}
              {data.features && data.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                >
                  {data.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">{feature}</p>
                    </div>
                  ))}
                </motion.div>
              )}
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link href={data.ctaLink || '/products'}>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-blue-500/25"
                  >
                    {data.ctaText || 'Ver Produtos'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/sobre">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-card border border-border text-foreground font-semibold rounded-xl hover:border-blue-500/50 transition-colors"
                  >
                    Sobre Nós
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-10">
              <div className="w-full h-full border-[30px] border-blue-500 rounded-full" />
            </div>
            <div className="absolute -top-10 -left-10 w-32 h-32 opacity-10">
              <div className="w-full h-full border-[15px] border-primary rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
