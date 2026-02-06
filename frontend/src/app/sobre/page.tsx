'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Target, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Shield,
  Heart,
  Zap,
  Star,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const timeline = [
  {
    year: '2008',
    title: 'O Início da Jornada',
    description: 'A USS Brasil nasceu em Criciúma com um sonho: trazer tecnologia de qualidade para o sul catarinense. Começamos pequenos, mas com grandes ambições.',
  },
  {
    year: '2012',
    title: 'Primeira Expansão',
    description: 'Abrimos nossa segunda loja e começamos a atender revendedores. Nossa reputação de qualidade e confiança se espalhou.',
  },
  {
    year: '2016',
    title: 'Nasce a WavePro',
    description: 'Lançamos nossa marca própria de películas premium. Um marco que nos diferenciou no mercado e elevou nosso padrão de qualidade.',
  },
  {
    year: '2020',
    title: 'Transformação Digital',
    description: 'Expandimos para o e-commerce, levando nossos produtos para todo o Brasil. A pandemia acelerou nossa transformação digital.',
  },
  {
    year: '2024',
    title: 'Liderança Nacional',
    description: 'Hoje somos referência em revenda de tecnologia, com milhares de clientes satisfeitos em todo o país.',
  },
];

const values = [
  {
    icon: Shield,
    title: 'Qualidade Garantida',
    description: 'Trabalhamos apenas com produtos originais e homologados. Sua segurança é nossa prioridade.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Heart,
    title: 'Atendimento Humanizado',
    description: 'Cada cliente é único. Oferecemos um atendimento personalizado e consultivo.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: Zap,
    title: 'Inovação Constante',
    description: 'Estamos sempre buscando as últimas novidades do mercado para nossos clientes.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Star,
    title: 'Excelência em Tudo',
    description: 'Do primeiro contato ao pós-venda, buscamos a excelência em cada detalhe.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

const stats = [
  { value: '15+', label: 'Anos de Mercado' },
  { value: '50mil+', label: 'Clientes Atendidos' },
  { value: '10mil+', label: 'Produtos Vendidos' },
  { value: '4.9', label: 'Avaliação Média' },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6"
              >
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">Nossa História</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
                Mais que uma loja,
                <br />
                <span className="text-primary">uma parceria</span>
              </h1>
              
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                Há mais de 15 anos, a USS Brasil e WavePro constroem uma história de confiança, 
                inovação e excelência no mercado de tecnologia brasileiro.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-primary text-black font-bold rounded-xl flex items-center gap-2 shadow-glow"
                  >
                    Conhecer Produtos
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="/contato">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-surface border border-border text-foreground font-medium rounded-xl hover:border-primary/50"
                  >
                    Fale Conosco
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-2xl border border-border p-6 text-center"
                >
                  <div className="text-4xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Nossa Jornada</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Uma história de paixão por tecnologia
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8 pb-12 last:pb-0 border-l-2 border-primary/30"
              >
                <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] bg-primary rounded-full" />
                <div className="bg-card rounded-2xl border border-border p-6 ml-4">
                  <span className="text-primary font-bold text-lg">{item.year}</span>
                  <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">{item.title}</h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Nossos Valores</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              O que nos move todos os dias
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl border border-border p-6 text-center group"
              >
                <div className={`w-16 h-16 ${value.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-8 h-8 ${value.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-text-secondary text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Nossa Missão</h3>
              <p className="text-text-secondary leading-relaxed">
                Ser a ponte entre a inovação tecnológica e nossos clientes, oferecendo produtos 
                de qualidade excepcional, preços justos e um atendimento que transforma cada 
                compra em uma experiência memorável.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Nossa Visão</h3>
              <p className="text-text-secondary leading-relaxed">
                Ser reconhecida como a melhor empresa de revenda de tecnologia do Brasil, 
                referência em qualidade, inovação e atendimento ao cliente. Queremos que 
                cada cliente se torne um parceiro de longa data.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WavePro Brand */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-card to-primary/5 border border-primary/20 p-12 md:p-16 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="text-primary text-sm font-medium uppercase tracking-wider">Nossa Marca</span>
                <h2 className="text-4xl md:text-5xl font-black mt-2 mb-6">
                  <span className="text-primary">WAVE</span>
                  <span className="text-foreground">PRO</span>
                </h2>
                <p className="text-xl text-text-secondary mb-6 leading-relaxed">
                  Em 2016, nasceu a WavePro - nossa linha própria de películas premium. 
                  Desenvolvida com a mais alta tecnologia, a WavePro se tornou sinônimo 
                  de proteção máxima e qualidade excepcional.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Vidro temperado 9H de alta resistência',
                    'Cobertura edge-to-edge perfeita',
                    'Anti-reflexo e anti-digital',
                    'Garantia de satisfação ou dinheiro de volta',
                  ].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-text-secondary"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <Link href="/wavepro">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(234, 179, 8, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-primary text-black font-bold rounded-xl inline-flex items-center gap-2 shadow-glow"
                  >
                    Conhecer WavePro
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Onde Estamos</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Venha nos visitar
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-6 text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Endereço</h3>
              <p className="text-text-secondary text-sm">
                Rua Henrique Lage, 123<br />
                Centro, Criciúma - SC<br />
                CEP: 88801-010
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-6 text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Telefone</h3>
              <p className="text-text-secondary text-sm">
                WhatsApp: (48) 99999-9999<br />
                Fixo: (48) 3333-3333
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-6 text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Horário</h3>
              <p className="text-text-secondary text-sm">
                Segunda a Sexta: 8h - 18h<br />
                Sábado: 8h - 12h
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pronto para fazer parte dessa história?
            </h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de clientes satisfeitos e descubra por que somos 
              a escolha certa para suas necessidades de tecnologia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-primary text-black font-bold rounded-xl flex items-center gap-2 shadow-glow"
                >
                  Explorar Produtos
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/contato">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-surface border border-border text-foreground font-medium rounded-xl hover:border-primary/50"
                >
                  Entrar em Contato
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
