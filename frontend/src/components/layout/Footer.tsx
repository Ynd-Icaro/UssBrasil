'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Mail, 
  Instagram, 
  Clock,
  ChevronRight,
  CreditCard,
  Shield,
  Truck,
  ExternalLink
} from 'lucide-react';

const contactInfo = {
  phones: [
    { label: 'Comercial', number: '(48) 3045-6044', href: 'tel:4830456044' },
    { label: 'Financeiro', number: '(48) 99999-4043', href: 'tel:48999994043' },
    { label: 'Vendas', number: '(48) 99196-9371', href: 'tel:48991969371' },
    { label: 'Vendas - Shopping della', number: '(48) 99183-2760', href: 'tel:48991832760' },
  ],
  locations: [
    { 
      name: 'Loja Centro',
      address: 'Praça Nereu Ramos, 364',
      city: 'Centro - Criciúma/SC',
      cep: 'CEP 88801-505',
      maps: 'https://maps.google.com'
    },
    { 
      name: 'Loja Marechal',
      address: 'Rua Marechal Deodoro, 195',
      city: 'Criciúma/SC',
      cep: 'CEP 88801-110',
      maps: 'https://maps.google.com'
    },
  ],
  instagram: [
    { handle: '@comercialussbrasil', href: 'https://instagram.com/comercialussbrasil', main: true },
    { handle: '@cricellimportsoficial', href: 'https://instagram.com/cricellimportsoficial' },
    { handle: '@waveprotecnologia', href: 'https://instagram.com/waveprotecnologia' },
  ],
  email: 'contato@ussbrasil.com.br'
};

const footerLinks = {
  institucional: [
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Nossas Lojas', href: '/lojas' },
    { label: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
    { label: 'Perguntas Frequentes', href: '/faq' },
  ],
  ajuda: [
    { label: 'Como Comprar', href: '/faq#pedidos' },
    { label: 'Formas de Pagamento', href: '/parcelamento' },
    { label: 'Entregas', href: '/entregas' },
    { label: 'Trocas e Devoluções', href: '/trocas' },
  ],
  categorias: [
    { label: 'Películas', href: '/categories/peliculas' },
    { label: 'Capas', href: '/categories/capas' },
    { label: 'Acessórios', href: '/categories/acessorios' },
    { label: 'WavePro', href: '/wavepro' },
  ],
};

const benefits = [
  { icon: Truck, title: 'Frete Grátis', desc: 'Acima de R$ 199' },
  { icon: CreditCard, title: 'Até 12x', desc: 'Sem juros no cartão' },
  { icon: Shield, title: 'Compra Segura', desc: 'Dados protegidos' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Benefits Bar */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 justify-center md:justify-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                  <p className="text-sm text-text-secondary">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
        >
          {/* Logo & Description */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-black tracking-tight">
                <span className="text-foreground">USS</span>
                <span className="text-primary">BRASIL</span>
              </span>
            </Link>
            <p className="text-text-secondary leading-relaxed mb-6 max-w-md">
              Há mais de 15 anos oferecendo os melhores produtos em tecnologia e acessórios para smartphones. 
              Qualidade, preço justo e atendimento de excelência.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {contactInfo.instagram.map((social) => (
                <a
                  key={social.handle}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300
                    ${social.main 
                      ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20' 
                      : 'bg-surface border-border text-text-secondary hover:border-primary/30 hover:text-primary'}
                  `}
                >
                  <Instagram className="w-4 h-4" />
                  <span className="text-sm font-medium">{social.handle}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          <motion.div variants={itemVariants}>
            <h3 className="text-foreground font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full" />
              Institucional
            </h3>
            <ul className="space-y-3">
              {footerLinks.institucional.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-foreground font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full" />
              Ajuda
            </h3>
            <ul className="space-y-3">
              {footerLinks.ajuda.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-foreground font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full" />
              Contato
            </h3>
            <ul className="space-y-4">
              {contactInfo.phones.map((phone) => (
                <li key={phone.number}>
                  <a 
                    href={phone.href}
                    className="flex items-start gap-3 text-text-secondary hover:text-primary transition-colors group"
                  >
                    <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-text-muted block">{phone.label}</span>
                      <span className="group-hover:text-primary">{phone.number}</span>
                    </div>
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Locations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-border"
        >
          <h3 className="text-foreground font-semibold mb-8 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Nossas Lojas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.locations.map((location, index) => (
              <motion.a
                key={location.name}
                href={location.maps}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group p-6 bg-surface rounded-2xl border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-foreground font-medium mb-2 flex items-center gap-2">
                      {location.name}
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </h4>
                    <p className="text-text-secondary">{location.address}</p>
                    <p className="text-text-secondary">{location.city}</p>
                    <p className="text-text-muted text-sm mt-1">{location.cep}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm text-text-muted">
                  <Clock className="w-4 h-4" />
                  <span>Seg - Sex: 9h às 20h | Sáb: 9h às 13h</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 opacity-60">
            <span className="text-text-muted text-sm">Formas de pagamento:</span>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-surface rounded-lg border border-border text-text-secondary text-sm">Visa</div>
              <div className="px-4 py-2 bg-surface rounded-lg border border-border text-text-secondary text-sm">Mastercard</div>
              <div className="px-4 py-2 bg-surface rounded-lg border border-border text-text-secondary text-sm">PIX</div>
              <div className="px-4 py-2 bg-surface rounded-lg border border-border text-text-secondary text-sm">Boleto</div>
              <div className="px-4 py-2 bg-surface rounded-lg border border-border text-text-secondary text-sm">Elo</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
            <p>© {new Date().getFullYear()} USSBRASIL. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacidade" className="hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="hover:text-primary transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
