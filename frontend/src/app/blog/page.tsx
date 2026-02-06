'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ChevronRight, 
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  Search
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog?published=true`);
        if (response.ok) {
          const data = await response.json();
          setPosts(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
        // Mock data para demonstração
        setPosts([
          {
            id: '1',
            title: 'Guia Completo: Como Escolher a Película Ideal para seu Smartphone',
            slug: 'como-escolher-pelicula-ideal',
            excerpt: 'Descubra as diferenças entre os tipos de películas e qual é a melhor opção para proteger seu aparelho.',
            content: '',
            imageUrl: '/images/blog/pelicula-guide.jpg',
            author: 'USS Brasil',
            category: 'Dicas',
            tags: ['películas', 'proteção', 'smartphones'],
            isPublished: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'iPhone 15 Pro Max: Vale a Pena o Upgrade?',
            slug: 'iphone-15-pro-max-review',
            excerpt: 'Análise completa do novo iPhone 15 Pro Max com todas as novidades e comparativos.',
            content: '',
            imageUrl: '/images/blog/iphone-review.jpg',
            author: 'USS Brasil',
            category: 'Reviews',
            tags: ['iphone', 'apple', 'review'],
            isPublished: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            title: 'WavePro: A Tecnologia por Trás da Proteção Premium',
            slug: 'wavepro-tecnologia-protecao',
            excerpt: 'Conheça a tecnologia exclusiva WavePro e por que ela é a melhor escolha para seu dispositivo.',
            content: '',
            imageUrl: '/images/blog/wavepro-tech.jpg',
            author: 'USS Brasil',
            category: 'Tecnologia',
            tags: ['wavepro', 'tecnologia', 'proteção'],
            isPublished: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
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
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Blog USS Brasil</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Dicas, Novidades e{' '}
              <span className="text-primary">Tecnologia</span>
            </h1>
            
            <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
              Fique por dentro das últimas novidades em tecnologia, dicas de proteção 
              e reviews dos melhores produtos do mercado.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
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
            <span className="text-foreground font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-surface" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-surface rounded w-1/4" />
                    <div className="h-6 bg-surface rounded w-3/4" />
                    <div className="h-4 bg-surface rounded w-full" />
                    <div className="h-4 bg-surface rounded w-2/3" />
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
              {filteredPosts.map((post, index) => (
                <motion.article 
                  key={post.id} 
                  variants={itemVariants}
                  className={index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500">
                      {/* Image */}
                      <div className={`relative overflow-hidden ${index === 0 ? 'h-64 md:h-80' : 'h-48'}`}>
                        {post.imageUrl ? (
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-primary/30" />
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        {post.category && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-primary text-black text-sm font-medium rounded-full">
                              {post.category}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.createdAt)}
                          </span>
                          {post.author && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {post.author}
                            </span>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h2 className={`font-bold text-foreground group-hover:text-primary transition-colors mb-3 ${
                          index === 0 ? 'text-2xl' : 'text-lg'
                        }`}>
                          {post.title}
                        </h2>
                        
                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className={`text-text-secondary mb-4 ${
                            index === 0 ? 'line-clamp-3' : 'line-clamp-2'
                          }`}>
                            {post.excerpt}
                          </p>
                        )}
                        
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span 
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-surface text-text-muted text-xs rounded-lg"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Read More */}
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <span>Ler mais</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm ? 'Nenhum artigo encontrado' : 'Nenhum artigo publicado'}
              </h3>
              <p className="text-text-secondary">
                {searchTerm 
                  ? 'Tente buscar por outro termo.' 
                  : 'Os artigos serão publicados em breve.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Receba Nossas Novidades
            </h2>
            <p className="text-text-secondary mb-8">
              Inscreva-se na nossa newsletter e receba dicas, promoções e novidades 
              diretamente no seu email.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
