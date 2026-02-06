'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail, MapPin, Clock, ChevronDown, HelpCircle, FileText, Truck, CreditCard, RefreshCw, Shield } from 'lucide-react';

const contactOptions = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '(11) 99999-9999',
    description: 'Atendimento rápido',
    action: 'https://wa.me/5511999999999',
    highlight: true,
  },
  {
    icon: Phone,
    title: 'Telefone',
    value: '(11) 3333-4444',
    description: 'Seg a Sex, 9h às 18h',
    action: 'tel:+551133334444',
  },
  {
    icon: Mail,
    title: 'E-mail',
    value: 'contato@ussbrasil.com.br',
    description: 'Resposta em até 24h',
    action: 'mailto:contato@ussbrasil.com.br',
  },
];

const quickFaqs = [
  {
    question: 'Como rastrear meu pedido?',
    answer: 'Acesse "Meus Pedidos" na sua conta ou use o código de rastreio enviado por e-mail.',
    icon: Truck,
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos cartões de crédito (até 12x), PIX com 10% de desconto, e boleto bancário.',
    icon: CreditCard,
  },
  {
    question: 'Posso trocar ou devolver um produto?',
    answer: 'Sim, você tem 7 dias após o recebimento para trocar ou devolver. O produto deve estar lacrado.',
    icon: RefreshCw,
  },
  {
    question: 'Os produtos têm garantia?',
    answer: 'Todos os produtos possuem garantia de fábrica. O prazo varia de acordo com o fabricante.',
    icon: Shield,
  },
];

const helpLinks = [
  { icon: FileText, label: 'Política de Privacidade', href: '/privacidade' },
  { icon: FileText, label: 'Termos de Uso', href: '/termos' },
  { icon: Truck, label: 'Política de Entrega', href: '/entregas' },
  { icon: RefreshCw, label: 'Trocas e Devoluções', href: '/trocas' },
];

export default function HelpSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            Central de Ajuda
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Como podemos ajudar?
          </h2>
          <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
            Estamos sempre prontos para atender você. Escolha o canal de sua preferência.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Options */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Fale Conosco
            </h3>
            
            <div className="space-y-4">
              {contactOptions.map((option, index) => (
                <motion.a
                  key={option.title}
                  href={option.action}
                  target={option.action.startsWith('http') ? '_blank' : undefined}
                  rel={option.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                      option.highlight
                        ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                        : 'bg-card border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      option.highlight ? 'bg-green-500/20' : 'bg-primary/10'
                    }`}>
                      <option.icon className={`w-6 h-6 ${option.highlight ? 'text-green-500' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{option.title}</h4>
                      <p className="text-sm text-text-secondary">{option.value}</p>
                      <p className="text-xs text-text-muted">{option.description}</p>
                    </div>
                  </motion.div>
                </motion.a>
              ))}
            </div>

            {/* Help Links */}
            <div className="mt-8 p-4 bg-card rounded-xl border border-border">
              <h4 className="font-medium text-foreground mb-4">Links Úteis</h4>
              <div className="grid grid-cols-2 gap-3">
                {helpLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick FAQs */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Perguntas Frequentes
            </h3>

            <div className="space-y-3">
              {quickFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center gap-4 p-4 text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <faq.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="flex-1 font-medium text-foreground">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pl-18 text-text-secondary text-sm">
                          <div className="ml-14">{faq.answer}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* View All FAQs */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <Link href="/faq">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-colors"
                >
                  Ver todas as perguntas
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
