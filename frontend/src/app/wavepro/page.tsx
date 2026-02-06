'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Shield, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Zap,
  Eye,
  Fingerprint,
  Droplets,
  Sun,
  ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Proteção 9H',
    description: 'Vidro temperado com dureza máxima. Resistente a riscos e impactos.',
  },
  {
    icon: Eye,
    title: 'Clareza 99.9%',
    description: 'Transmissão de luz perfeita. Não interfere na qualidade da tela.',
  },
  {
    icon: Fingerprint,
    title: 'Anti-Digital',
    description: 'Revestimento oleofóbico que repele marcas de dedos.',
  },
  {
    icon: Droplets,
    title: 'Hidrofóbico',
    description: 'Camada que repele água e facilita a limpeza.',
  },
  {
    icon: Sun,
    title: 'Anti-Reflexo',
    description: 'Melhor visibilidade em ambientes externos.',
  },
  {
    icon: Zap,
    title: 'Fácil Instalação',
    description: 'Kit completo para aplicação perfeita.',
  },
];

const products = [
  {
    name: 'WavePro Glass',
    description: 'Película de vidro temperado premium',
    price: 'R$ 29,90',
    badge: 'Mais Vendido',
  },
  {
    name: 'WavePro Matte',
    description: 'Película fosca anti-reflexo para gamers',
    price: 'R$ 34,90',
    badge: 'Gamers',
  },
  {
    name: 'WavePro Privacy',
    description: 'Película com filtro de privacidade 180°',
    price: 'R$ 39,90',
    badge: 'Empresarial',
  },
  {
    name: 'WavePro Ceramic',
    description: 'Película cerâmica flexível - não quebra',
    price: 'R$ 44,90',
    badge: 'Premium',
  },
];

const stats = [
  { value: '500K+', label: 'Películas Vendidas' },
  { value: '4.9', label: 'Avaliação Média' },
  { value: '2000+', label: 'Revendedores' },
  { value: '100%', label: 'Satisfação' },
];

export default function WaveProPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-yellow-500/20 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Partner Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Marca Parceira USS Brasil
              </span>
            </motion.div>

            {/* Main Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 60px rgba(234, 179, 8, 0.3)',
                      '0 0 100px rgba(234, 179, 8, 0.5)',
                      '0 0 60px rgba(234, 179, 8, 0.3)',
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <Shield className="w-20 h-20 md:w-28 md:h-28 text-black" />
                </motion.div>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6">
                <span className="text-yellow-500">WAVE</span>
                <span className="text-white">PRO</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-4">
                Proteção máxima para seu smartphone
              </p>
              <p className="text-gray-500 max-w-xl mx-auto">
                As películas mais avançadas do mercado brasileiro. Tecnologia de ponta para proteger sua tela.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <a
                href="https://wavepro.com.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(234, 179, 8, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-yellow-500 text-black font-bold text-lg rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                >
                  Acessar Site Oficial
                  <ExternalLink className="w-5 h-5" />
                </motion.button>
              </a>
              <Link href="/products?brand=wavepro">
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: 'rgba(234, 179, 8, 0.8)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-transparent border-2 border-yellow-500/50 text-white font-semibold text-lg rounded-2xl flex items-center gap-3 transition-colors"
                >
                  Comprar na USS Brasil
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black text-yellow-500 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-yellow-500/50 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-yellow-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-500 text-sm font-bold uppercase tracking-[0.2em]">
              Tecnologia
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4">
              Por que escolher WavePro?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, borderColor: 'rgba(234, 179, 8, 0.5)' }}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 group transition-all duration-300"
              >
                <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-500 text-sm font-bold uppercase tracking-[0.2em]">
              Produtos
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4">
              Linha Completa WavePro
            </h2>
            <p className="text-gray-500 mt-4">
              Disponíveis para revenda exclusiva na USS Brasil
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6 group overflow-hidden"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    {product.badge}
                  </span>
                </div>

                {/* Product Icon */}
                <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-10 h-10 text-yellow-500" />
                </div>

                <h3 className="text-lg font-bold text-white text-center mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm text-center mb-4">{product.description}</p>
                
                <div className="text-yellow-500 font-bold text-xl text-center mb-4">
                  A partir de {product.price}
                </div>

                {/* Hover effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/products?brand=wavepro">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-transparent border-2 border-yellow-500/50 text-yellow-500 font-bold rounded-xl flex items-center gap-2 mx-auto hover:bg-yellow-500/10 transition-colors"
              >
                Ver Todos os Produtos
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partnership Banner */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-yellow-500/20 via-yellow-500/5 to-transparent border border-yellow-500/20 p-12 md:p-16 overflow-hidden max-w-5xl mx-auto"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <span className="text-3xl text-gray-600">×</span>
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-black text-lg">USS</span>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Parceria Oficial
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                A USS Brasil é revendedora oficial dos produtos WavePro. 
                Compre com a garantia e qualidade de duas marcas reconhecidas no mercado brasileiro.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://wavepro.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-xl flex items-center gap-2"
                  >
                    Site Oficial WavePro
                    <ExternalLink className="w-5 h-5" />
                  </motion.button>
                </a>
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2"
                  >
                    Loja USS Brasil
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">
            WavePro® - Todos os direitos reservados
          </p>
          <a
            href="https://wavepro.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 font-medium inline-flex items-center gap-2"
          >
            wavepro.com.br
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
