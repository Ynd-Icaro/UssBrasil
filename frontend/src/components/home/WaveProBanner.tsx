'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Star, CheckCircle } from 'lucide-react';

interface WaveProBannerProps {
  variant?: 'full' | 'compact';
}

export default function WaveProBanner({ variant = 'full' }: WaveProBannerProps) {
  if (variant === 'compact') {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Link href="/wavepro">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black via-zinc-900 to-black border border-yellow-500/30 p-6 md:p-8 flex items-center justify-between cursor-pointer group"
            >
              {/* Yellow glow effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px]" />
              
              <div className="relative flex items-center gap-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                  <Shield className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black">
                    <span className="text-yellow-500">WAVE</span>
                    <span className="text-white">PRO</span>
                  </h3>
                  <p className="text-zinc-400 text-sm">Películas Premium com Tecnologia de Ponta</p>
                </div>
              </div>
              <motion.div
                className="relative flex items-center gap-2 text-yellow-500 font-semibold"
                whileHover={{ x: 5 }}
              >
                Conhecer <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </motion.div>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-zinc-900 to-black border border-yellow-500/30"
        >
          {/* Background patterns - Yellow/Black theme */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]" />
          
          {/* Diagonal stripes */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(234,179,8,0.5)_10px,rgba(234,179,8,0.5)_20px)]" />
          </div>
          
          <div className="relative z-10 p-8 md:p-12 lg:p-20 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-6"
              >
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-500 text-sm font-semibold uppercase tracking-wider">
                  Marca Premium Exclusiva
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
              >
                <span className="text-yellow-500">WAVE</span>
                <span className="text-white">PRO</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-zinc-400 mb-6 max-w-lg"
              >
                Películas premium com tecnologia de ponta. Proteção máxima, clareza cristalina e durabilidade excepcional para seu smartphone.
              </motion.p>

              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-3 mb-8"
              >
                {[
                  'Vidro temperado 9H de alta resistência',
                  'Cobertura de borda a borda',
                  'Anti-reflexo e anti-digital',
                  'Garantia de satisfação',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </motion.ul>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/wavepro">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(234, 179, 8, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-yellow-500 text-black font-black rounded-xl inline-flex items-center gap-2 shadow-lg shadow-yellow-500/30"
                  >
                    Conhecer WavePro
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/products?brand=wavepro">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-transparent border-2 border-yellow-500/50 text-yellow-500 font-bold rounded-xl hover:bg-yellow-500/10 transition-colors"
                  >
                    Ver Produtos
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            
            {/* WavePro Logo/Shield */}
            <div className="flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-full flex items-center justify-center border-2 border-yellow-500/40 relative"
                >
                  {/* Animated rings */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-yellow-500/30"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute inset-0 rounded-full border border-yellow-500/20"
                  />
                  
                  <Shield className="w-24 h-24 md:w-32 md:h-32 text-yellow-500" />
                </motion.div>
                
                {/* Floating badges */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-yellow-500 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
                >
                  #1 Vendas
                </motion.div>
                
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -left-4 bg-black border border-yellow-500/50 text-yellow-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
                >
                  <Star className="w-3 h-3 fill-yellow-500" />
                  Premium
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
