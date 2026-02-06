'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CreditCard, QrCode, Wallet, Building2, Shield, Clock, Percent, CheckCircle } from 'lucide-react';

const paymentMethods = [
  { name: 'Visa', logo: '/images/payments/visa.svg' },
  { name: 'Mastercard', logo: '/images/payments/mastercard.svg' },
  { name: 'Elo', logo: '/images/payments/elo.svg' },
  { name: 'American Express', logo: '/images/payments/amex.svg' },
  { name: 'Hipercard', logo: '/images/payments/hipercard.svg' },
  { name: 'PIX', logo: '/images/payments/pix.svg' },
  { name: 'Boleto', logo: '/images/payments/boleto.svg' },
];

const securityBadges = [
  { name: 'SSL Secure', icon: Shield },
  { name: 'PCI Compliant', icon: CheckCircle },
  { name: 'Compra Segura', icon: Shield },
];

const paymentFeatures = [
  {
    icon: CreditCard,
    title: 'Até 12x sem juros',
    description: 'Parcelamento facilitado nos cartões',
  },
  {
    icon: QrCode,
    title: '10% OFF no PIX',
    description: 'Desconto exclusivo para pagamento à vista',
  },
  {
    icon: Building2,
    title: 'Boleto Bancário',
    description: 'Vencimento em 3 dias úteis',
  },
  {
    icon: Wallet,
    title: 'Carteiras Digitais',
    description: 'Google Pay, Apple Pay e mais',
  },
];

export default function PaymentMethodsSection() {
  return (
    <section className="py-20 bg-surface border-t border-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Formas de Pagamento
          </h2>
          <p className="text-text-secondary mt-2">
            Escolha a melhor opção para você
          </p>
        </motion.div>

        {/* Payment Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {paymentFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-border p-4 md:p-6 text-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-text-muted">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl border border-border p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative w-16 h-10 md:w-20 md:h-12 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                {/* Fallback to text if image not available */}
                <div className="w-full h-full flex items-center justify-center bg-surface rounded-lg border border-border/50">
                  <span className="text-xs font-medium text-text-muted">{method.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Security Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {securityBadges.map((badge, index) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-text-muted"
                >
                  <badge.icon className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Installment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-text-muted">
            * Parcelamento sujeito à análise de crédito. Consulte as condições de pagamento na página do produto.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
