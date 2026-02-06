'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Tag,
  BookOpen
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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else if (response.status === 404) {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao buscar post:', error);
        // Mock data para demonstração
        setPost({
          id: '1',
          title: 'Guia Completo: Como Escolher a Película Ideal para seu Smartphone',
          slug: 'como-escolher-pelicula-ideal',
          excerpt: 'Descubra as diferenças entre os tipos de películas e qual é a melhor opção para proteger seu aparelho.',
          content: `
            <h2>Introdução</h2>
            <p>A proteção do seu smartphone é essencial para garantir sua durabilidade e manter o valor de revenda. Uma das formas mais eficazes de proteção é a aplicação de uma película de qualidade.</p>
            
            <h2>Tipos de Películas</h2>
            <h3>1. Películas de Vidro Temperado</h3>
            <p>As películas de vidro temperado são as mais populares e oferecem excelente proteção contra impactos. São fabricadas com vidro tratado termicamente, o que aumenta sua resistência.</p>
            
            <h3>2. Películas de Hidrogel</h3>
            <p>As películas de hidrogel são mais flexíveis e se adaptam melhor às telas curvas. Possuem propriedade de auto-regeneração para pequenos riscos.</p>
            
            <h3>3. Películas Cerâmicas</h3>
            <p>As películas cerâmicas combinam a dureza do vidro com a flexibilidade do hidrogel, oferecendo proteção superior.</p>
            
            <h2>WavePro: A Evolução em Proteção</h2>
            <p>A WavePro desenvolveu uma tecnologia exclusiva que combina o melhor dos três tipos de películas, oferecendo:</p>
            <ul>
              <li>Resistência a impactos 5x maior</li>
              <li>Oleofobicidade superior</li>
              <li>Clareza ótica perfeita</li>
              <li>Instalação profissional garantida</li>
            </ul>
            
            <h2>Como Escolher</h2>
            <p>Para escolher a película ideal, considere:</p>
            <ol>
              <li>Modelo do seu smartphone</li>
              <li>Seu estilo de uso</li>
              <li>Orçamento disponível</li>
              <li>Preferência de acabamento (brilho ou fosco)</li>
            </ol>
            
            <h2>Conclusão</h2>
            <p>Investir em uma película de qualidade é garantir a proteção do seu investimento. A WavePro oferece a melhor relação custo-benefício do mercado.</p>
          `,
          imageUrl: '/images/blog/pelicula-guide.jpg',
          author: 'USS Brasil',
          category: 'Dicas',
          tags: ['películas', 'proteção', 'smartphones'],
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
            <div className="h-8 bg-card rounded w-3/4" />
            <div className="h-4 bg-card rounded w-1/2" />
            <div className="h-96 bg-card rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-card rounded" />
              <div className="h-4 bg-card rounded" />
              <div className="h-4 bg-card rounded w-2/3" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Artigo não encontrado</h1>
          <p className="text-text-secondary mb-6">O artigo que você procura não existe ou foi removido.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Image */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <span className="px-4 py-2 bg-primary text-black text-sm font-medium rounded-full">
              {post.category}
            </span>
          </div>
        )}
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/50 -mt-20 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
              Início
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <Link href="/blog" className="text-text-secondary hover:text-primary transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {post.title}
              </h1>
              
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.createdAt)}
                </span>
                {post.author && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-text-secondary border-l-4 border-primary pl-4">
                  {post.excerpt}
                </p>
              )}
            </motion.header>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 pt-8 border-t border-border"
              >
                <h3 className="text-sm font-semibold text-text-muted mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-surface text-text-secondary text-sm rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Blog
              </Link>
            </motion.div>
          </div>
        </div>
      </article>
    </main>
  );
}
