'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Tag, 
  Copy, 
  Check,
  Gift,
  Percent,
  Truck,
  Calendar,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  description: string;
  minOrderValue?: number;
  maxDiscount?: number;
  validUntil: string;
  usageLimit?: number;
  isNew?: boolean;
  isExclusive?: boolean;
}

const availableCoupons: Coupon[] = [
  {
    code: 'BEMVINDO10',
    type: 'percentage',
    value: 10,
    description: 'Desconto de primeira compra',
    minOrderValue: 100,
    validUntil: '2025-12-31',
    usageLimit: 1,
    isNew: true,
  },
  {
    code: 'WAVEPRO20',
    type: 'percentage',
    value: 20,
    description: 'Desconto em produtos WavePro',
    minOrderValue: 200,
    maxDiscount: 100,
    validUntil: '2025-03-31',
    isExclusive: true,
  },
  {
    code: 'FRETEGRATIS',
    type: 'shipping',
    value: 0,
    description: 'Frete grátis em qualquer compra',
    minOrderValue: 150,
    validUntil: '2025-06-30',
  },
  {
    code: 'DESCONTO50',
    type: 'fixed',
    value: 50,
    description: 'R$ 50 de desconto',
    minOrderValue: 300,
    validUntil: '2025-04-30',
  },
  {
    code: 'APPLE15',
    type: 'percentage',
    value: 15,
    description: 'Desconto em acessórios Apple',
    minOrderValue: 250,
    maxDiscount: 150,
    validUntil: '2025-05-31',
  },
];

function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success('Cupom copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar cupom');
    }
  };

  const getIcon = () => {
    switch (coupon.type) {
      case 'percentage':
        return <Percent className="w-6 h-6" />;
      case 'fixed':
        return <Gift className="w-6 h-6" />;
      case 'shipping':
        return <Truck className="w-6 h-6" />;
    }
  };

  const getDiscountText = () => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.value}% OFF`;
      case 'fixed':
        return `R$ ${coupon.value} OFF`;
      case 'shipping':
        return 'FRETE GRÁTIS';
    }
  };

  const getColor = () => {
    switch (coupon.type) {
      case 'percentage':
        return 'text-primary bg-primary/10 border-primary/30';
      case 'fixed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'shipping':
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const isExpired = new Date(coupon.validUntil) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative bg-white rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-300
        ${isExpired ? 'border-gray-200 opacity-60' : 'border-primary/30 hover:border-primary hover:shadow-lg'}`}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {coupon.isNew && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            Novo
          </span>
        )}
        {coupon.isExclusive && (
          <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
            Exclusivo
          </span>
        )}
        {isExpired && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            Expirado
          </span>
        )}
      </div>

      {/* Ticket decoration */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className={`text-2xl font-bold ${isExpired ? 'text-gray-400' : 'text-text'}`}>
              {getDiscountText()}
            </p>
            <p className="text-text-secondary mt-1">{coupon.description}</p>
          </div>
        </div>

        {/* Conditions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {coupon.minOrderValue && (
            <span className="text-xs text-text-secondary bg-surface px-2 py-1 rounded-full">
              Mín. R$ {coupon.minOrderValue}
            </span>
          )}
          {coupon.maxDiscount && (
            <span className="text-xs text-text-secondary bg-surface px-2 py-1 rounded-full">
              Máx. R$ {coupon.maxDiscount}
            </span>
          )}
          {coupon.usageLimit && (
            <span className="text-xs text-text-secondary bg-surface px-2 py-1 rounded-full">
              {coupon.usageLimit}x por cliente
            </span>
          )}
        </div>

        {/* Code & Copy */}
        <div className="mt-6 pt-4 border-t border-dashed border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary mb-1">Código do cupom:</p>
            <code className={`text-lg font-mono font-bold tracking-wider
              ${isExpired ? 'text-gray-400' : 'text-primary'}`}>
              {coupon.code}
            </code>
          </div>

          {!isExpired && (
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
                ${copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-primary hover:bg-primary/90 text-white'}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
          )}
        </div>

        {/* Validity */}
        <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
          <Calendar className="w-3 h-3" />
          Válido até {new Date(coupon.validUntil).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </motion.div>
  );
}

export default function CuponsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-green-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Tag className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text">
                  Cupons de Desconto
                </h1>
                <p className="text-text-secondary">
                  Economize ainda mais nas suas compras
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-6 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-sm text-text">
            <Info className="w-4 h-4 text-primary" />
            <span>
              Copie o código do cupom e cole no carrinho antes de finalizar sua compra
            </span>
          </div>
        </div>
      </section>

      {/* Coupons Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCoupons.map((coupon) => (
              <CouponCard key={coupon.code} coupon={coupon} />
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-text mb-8 text-center">
              Como usar seu cupom?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: 1,
                  title: 'Escolha seu cupom',
                  description: 'Selecione o cupom ideal para você e clique em "Copiar"',
                },
                {
                  step: 2,
                  title: 'Adicione produtos',
                  description: 'Navegue pela loja e adicione os produtos desejados ao carrinho',
                },
                {
                  step: 3,
                  title: 'Aplique o desconto',
                  description: 'No carrinho, cole o código do cupom e veja o desconto aplicado',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-text mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border p-8">
            <h3 className="font-semibold text-text mb-4">Termos e Condições</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Cupons não são cumulativos entre si</li>
              <li>• Válido apenas para compras no site ussbrasil.com.br</li>
              <li>• Alguns cupons podem ter restrições de categoria ou marca</li>
              <li>• O desconto é aplicado no subtotal, não inclui frete</li>
              <li>• Cupons expirados não podem ser utilizados</li>
              <li>• A USS Brasil se reserva o direito de cancelar cupons a qualquer momento</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
