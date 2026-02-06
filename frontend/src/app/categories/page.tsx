'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Grid3X3, 
  ChevronRight, 
  Package,
  Smartphone,
  Headphones,
  Watch,
  Laptop,
  Camera,
  Gamepad2,
  Tv,
  Speaker,
  Shield,
  ArrowRight
} from 'lucide-react';

// Mapeamento de ícones por slug
const categoryIcons: Record<string, any> = {
  'smartphones': Smartphone,
  'acessorios': Headphones,
  'smartwatches': Watch,
  'notebooks': Laptop,
  'cameras': Camera,
  'games': Gamepad2,
  'tvs': Tv,
  'audio': Speaker,
  'peliculas': Shield,
  'capas': Package,
};

// Cores de gradiente por categoria
const categoryColors: Record<string, string> = {
  'smartphones': 'from-blue-500 to-blue-700',
  'acessorios': 'from-purple-500 to-purple-700',
  'smartwatches': 'from-green-500 to-green-700',
  'notebooks': 'from-gray-500 to-gray-700',
  'cameras': 'from-orange-500 to-orange-700',
  'games': 'from-red-500 to-red-700',
  'tvs': 'from-indigo-500 to-indigo-700',
  'audio': 'from-pink-500 to-pink-700',
  'peliculas': 'from-yellow-500 to-yellow-700',
  'capas': 'from-teal-500 to-teal-700',
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          // API pode retornar array direto ou { data: [...] }
          setCategories(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-card overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Grid3X3 className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Todas as Categorias</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Explore Nossas{' '}
              <span className="text-primary">Categorias</span>
            </h1>
            
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Encontre o que você procura navegando pelas nossas categorias. 
              Temos os melhores produtos das marcas mais reconhecidas do mercado.
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
            <span className="text-foreground font-medium">Categorias</span>
          </nav>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-card rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug] || Package;
                const gradient = categoryColors[category.slug] || 'from-primary to-primary/70';
                
                return (
                  <motion.div key={category.id} variants={itemVariants}>
                    <Link href={`/categories/${category.slug}`}>
                      <div className="group relative h-64 rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-500">
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        {/* Category Image */}
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover opacity-20 group-hover:opacity-10 transition-opacity duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-surface to-card" />
                        )}
                        
                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                          <div>
                            <div className="w-14 h-14 rounded-xl bg-surface/80 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors duration-500">
                              <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-500" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-foreground group-hover:text-white transition-colors duration-500">
                              {category.name}
                            </h3>
                            
                            {category.description && (
                              <p className="text-sm text-text-secondary mt-2 line-clamp-2 group-hover:text-white/80 transition-colors duration-500">
                                {category.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-text-muted group-hover:text-white/70 transition-colors duration-500">
                              {category._count?.products || 0} produtos
                            </span>
                            
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
                              <ArrowRight className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-text-secondary">
                As categorias serão exibidas aqui em breve.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-text-secondary mb-8">
              Entre em contato conosco e ajudaremos você a encontrar o produto ideal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Ver Todos os Produtos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contato"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border text-foreground font-semibold rounded-xl hover:border-primary/50 transition-colors"
              >
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
