'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  isLoading?: boolean;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    role: 'Empresário',
    company: 'Tech Store SP',
    content: 'Trabalho com a WavePro há mais de 3 anos. Produtos de qualidade excepcional e suporte impecável. Recomendo fortemente para qualquer revendedor.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'Gestora',
    company: 'Cell Center RJ',
    content: 'As películas WavePro são simplesmente as melhores do mercado. Meus clientes adoram e sempre voltam para comprar mais. Qualidade premium!',
    rating: 5,
  },
  {
    id: '3',
    name: 'João Pereira',
    role: 'Proprietário',
    company: 'Mobile Fix',
    content: 'Entrega rápida, produtos originais e preços competitivos. A equipe da USSBRASIL sempre nos atende com excelência. Parceria de sucesso!',
    rating: 5,
  },
];

export default function TestimonialsSection({ testimonials, isLoading = false }: TestimonialsSectionProps) {
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  if (isLoading) {
    return (
      <section className="py-20 bg-surface border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-4 w-24 bg-card rounded animate-pulse mx-auto mb-4" />
            <div className="h-8 w-64 bg-card rounded animate-pulse mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-8 animate-pulse">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-5 h-5 bg-surface rounded" />
                  ))}
                </div>
                <div className="h-24 bg-surface rounded mb-6" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface rounded-full" />
                  <div>
                    <div className="h-4 w-24 bg-surface rounded mb-2" />
                    <div className="h-3 w-32 bg-surface rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-surface border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Depoimentos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            O que nossos clientes dizem
          </h2>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
            A satisfação dos nossos parceiros é nossa maior conquista. Veja o que dizem sobre trabalhar conosco.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, borderColor: 'rgba(234, 179, 8, 0.3)' }}
              className="relative bg-card rounded-2xl p-8 border border-border transition-all duration-300 group"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-primary fill-primary'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-text-secondary leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.avatarUrl ? (
                  <Image
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-text-muted">
                    {testimonial.role}
                    {testimonial.company && ` • ${testimonial.company}`}
                  </p>
                </div>
              </div>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
