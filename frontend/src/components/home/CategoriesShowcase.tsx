'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Headphones, Shield, Battery, Cable, Watch, Laptop, Camera } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

interface CategoriesShowcaseProps {
  categories?: Category[];
  isLoading?: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  smartphones: Smartphone,
  audio: Headphones,
  peliculas: Shield,
  carregadores: Battery,
  cabos: Cable,
  smartwatches: Watch,
  notebooks: Laptop,
  cameras: Camera,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  smartphones: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
  audio: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
  peliculas: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
  carregadores: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
  cabos: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
  smartwatches: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/30' },
  notebooks: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/30' },
  cameras: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' },
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Smartphones', slug: 'smartphones', description: 'iPhone, Samsung, Xiaomi e mais', _count: { products: 500 } },
  { id: '2', name: 'Áudio', slug: 'audio', description: 'Fones, caixas de som e acessórios', _count: { products: 300 } },
  { id: '3', name: 'Películas', slug: 'peliculas', description: 'Proteção premium para seu device', _count: { products: 1000 } },
  { id: '4', name: 'Carregadores', slug: 'carregadores', description: 'Originais e turbo power', _count: { products: 250 } },
  { id: '5', name: 'Cabos', slug: 'cabos', description: 'USB-C, Lightning, Micro USB', _count: { products: 400 } },
  { id: '6', name: 'Smartwatches', slug: 'smartwatches', description: 'Apple Watch, Galaxy Watch', _count: { products: 150 } },
  { id: '7', name: 'Notebooks', slug: 'notebooks', description: 'MacBook, Dell, Lenovo', _count: { products: 80 } },
  { id: '8', name: 'Câmeras', slug: 'cameras', description: 'GoPro, DJI e acessórios', _count: { products: 60 } },
];

export default function CategoriesShowcase({ categories, isLoading = false }: CategoriesShowcaseProps) {
  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  if (isLoading) {
    return (
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-border/50 rounded w-48 mx-auto mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-border/30 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-surface">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Navegue por Categoria
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Encontre o que você precisa
          </h2>
          <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
            Explore nosso catálogo completo organizado por categorias. Milhares de produtos das melhores marcas do mundo.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.slice(0, 8).map((category, index) => {
            const IconComponent = categoryIcons[category.slug] || Smartphone;
            const colors = categoryColors[category.slug] || categoryColors.smartphones;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`group relative overflow-hidden rounded-2xl bg-card border ${colors.border} hover:border-primary/50 transition-all duration-300 p-6 h-full`}
                  >
                    {/* Background Effect */}
                    <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className={`relative w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-7 h-7 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-text-muted mb-3 line-clamp-2">
                        {category.description || 'Explore os produtos'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          {category._count?.products || 0}+ produtos
                        </span>
                        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/categories">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-colors"
            >
              Ver todas as categorias
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
