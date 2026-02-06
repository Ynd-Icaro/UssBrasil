'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Instagram,
  MessageCircle,
  CheckCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  subject: z.string().min(3, 'Assunto é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = {
  phones: [
    { label: 'Comercial', number: '(48) 3045-6044', href: 'tel:4830456044', icon: Phone },
    { label: 'Financeiro', number: '(48) 99999-4043', href: 'tel:48999994043', icon: Phone },
    { label: 'Vendas', number: '(48) 99196-9371', href: 'tel:48991969371', icon: MessageCircle },
    { label: 'Shopping della', number: '(48) 99183-2760', href: 'tel:48991832760', icon: MessageCircle },
  ],
  locations: [
    { 
      name: 'Loja Centro',
      address: 'Praça Nereu Ramos, 364',
      city: 'Centro - Criciúma/SC',
      cep: 'CEP 88801-505',
      hours: 'Seg - Sex: 9h às 20h | Sáb: 9h às 13h',
      maps: 'https://maps.google.com/?q=Praça+Nereu+Ramos+364+Criciuma'
    },
    { 
      name: 'Loja Marechal',
      address: 'Rua Marechal Deodoro, 195',
      city: 'Criciúma/SC',
      cep: 'CEP 88801-110',
      hours: 'Seg - Sex: 9h às 18h | Sáb: 9h às 13h',
      maps: 'https://maps.google.com/?q=Rua+Marechal+Deodoro+195+Criciuma'
    },
  ],
  instagram: [
    { handle: '@comercialussbrasil', href: 'https://instagram.com/comercialussbrasil' },
    { handle: '@waveprotecnologia', href: 'https://instagram.com/waveprotecnologia' },
    { handle: '@cricellimportsoficial', href: 'https://instagram.com/cricellimportsoficial' },
  ],
  email: 'contato@ussbrasil.com.br'
};

export default function ContatoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', data);
      setIsSuccess(true);
      reset();
      toast.success('Mensagem enviada com sucesso!');
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Entre em Contato</span>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mt-4 mb-6">
              Fale com a <span className="text-primary">USSBRASIL</span>
            </h1>
            <p className="text-lg text-text-secondary">
              Estamos aqui para ajudar! Entre em contato conosco por telefone, WhatsApp, 
              email ou visite uma de nossas lojas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Phone Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {contactInfo.phones.map((phone, index) => (
              <motion.a
                key={phone.number}
                href={phone.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, borderColor: 'rgba(234, 179, 8, 0.5)' }}
                className="p-6 bg-card rounded-2xl border border-border transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <phone.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-text-muted text-sm mb-1">{phone.label}</p>
                <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {phone.number}
                </p>
              </motion.a>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl border border-border p-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Envie uma Mensagem</h2>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Mensagem Enviada!</h3>
                  <p className="text-text-secondary">
                    Recebemos sua mensagem e entraremos em contato em breve.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">Nome *</label>
                      <input
                        {...register('name')}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Seu nome"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">Email *</label>
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="seu@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">Telefone *</label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="(48) 99999-9999"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">Assunto *</label>
                      <input
                        {...register('subject')}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Assunto da mensagem"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Mensagem *</label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Escreva sua mensagem aqui..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-2 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Mensagem
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Email */}
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">Email</p>
                  <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {contactInfo.email}
                  </p>
                </div>
              </a>

              {/* Instagram */}
              <div className="p-6 bg-card rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Instagram className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Siga-nos no Instagram</h3>
                </div>
                <div className="space-y-3">
                  {contactInfo.instagram.map((account) => (
                    <a
                      key={account.handle}
                      href={account.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-surface rounded-xl hover:bg-surface-hover transition-colors group"
                    >
                      <span className="text-text-secondary group-hover:text-primary transition-colors">
                        {account.handle}
                      </span>
                      <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Nossas Lojas
                </h3>
                {contactInfo.locations.map((location, index) => (
                  <motion.a
                    key={location.name}
                    href={location.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3 }}
                    className="block p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        {location.name}
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      </h4>
                      <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-text-secondary">{location.address}</p>
                    <p className="text-text-secondary">{location.city}</p>
                    <p className="text-text-muted text-sm mt-1">{location.cep}</p>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-text-muted text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{location.hours}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border border-border"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.6481231231!2d-49.3701234!3d-28.6794123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDQwJzQ1LjkiUyA0OcKwMjInMTIuNCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
