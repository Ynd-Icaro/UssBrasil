'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Newspaper, Calendar, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  slug: string;
  category: string;
  publishedAt: string;
  readTime: number;
}

interface BlogPreviewProps {
  posts?: BlogPost[];
  isLoading?: boolean;
}

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'iPhone 16: Tudo o que você precisa saber',
    excerpt: 'Confira as novidades, especificações e preços do novo iPhone 16 e iPhone 16 Pro.',
    slug: 'iphone-16-tudo-que-voce-precisa-saber',
    category: 'Lançamentos',
    publishedAt: '2024-01-15',
    readTime: 5,
  },
  {
    id: '2',
    title: 'Como escolher a película ideal para seu smartphone',
    excerpt: 'Guia completo sobre os tipos de película: vidro temperado, hidrogel, fosca e privacidade.',
    slug: 'como-escolher-pelicula-ideal-smartphone',
    category: 'Dicas',
    publishedAt: '2024-01-10',
    readTime: 4,
  },
  {
    id: '3',
    title: 'WavePro: Conheça nossa linha de películas premium',
    excerpt: 'Descubra por que a linha WavePro é a escolha dos profissionais e entusiastas.',
    slug: 'wavepro-linha-peliculas-premium',
    category: 'Produtos',
    publishedAt: '2024-01-05',
    readTime: 3,
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BlogPreview({ posts, isLoading = false }: BlogPreviewProps) {
  const displayPosts = posts && posts.length > 0 ? posts : defaultPosts;

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-border/50 rounded w-48 mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-border/30 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
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
              <Newspaper className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                Blog
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Novidades e Dicas
            </h2>
            <p className="text-text-secondary mt-2">
              Fique por dentro das últimas tendências em tecnologia
            </p>
          </div>
          <Link href="/blog">
            <motion.button
              whileHover={{ x: 5 }}
              className="text-primary font-medium flex items-center gap-2"
            >
              Ver todos os artigos
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {displayPosts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col"
                >
                  {/* Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-primary/30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary/90 text-background text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime} min de leitura
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
