'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, CreditCard, Headphones, Award, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Truck,
    title: 'Envio Rápido',
    description: 'Entrega para todo Brasil com rastreamento em tempo real',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    link: '/entregas',
  },
  {
    icon: Shield,
    title: 'Garantia Total',
    description: 'Todos os produtos com garantia de originalidade e qualidade',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    link: '/garantia',
  },
  {
    icon: CreditCard,
    title: 'Pagamento Facilitado',
    description: 'Até 12x sem juros no cartão ou desconto no PIX',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    link: '/pagamento',
  },
  {
    icon: Headphones,
    title: 'Suporte Especializado',
    description: 'Equipe técnica preparada para tirar todas as suas dúvidas',
    color: 'text-primary',
    bg: 'bg-primary/10',
    link: '/contato',
  },
];

const trustBadges = [
  { icon: Award, label: '15+ Anos de Mercado' },
  { icon: CheckCircle, label: 'Produtos Originais' },
  { icon: RefreshCw, label: '7 Dias para Troca' },
  { icon: Clock, label: 'Resposta em 24h' },
];

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Main Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={feature.link}>
                <motion.div
                  whileHover={{ y: -5, borderColor: 'rgba(234, 179, 8, 0.3)' }}
                  className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-border transition-all duration-300 group h-full"
                >
                  <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary">{feature.description}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-text-muted"
            >
              <badge.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
