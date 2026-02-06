'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const stores = [
  {
    id: 'centro',
    name: 'Loja Centro',
    address: 'Praça Nereu Ramos, 364',
    neighborhood: 'Centro',
    city: 'Criciúma',
    state: 'SC',
    zipCode: '88801-505',
    phone: '(48) 3045-6044',
    whatsapp: '5548991969371',
    hours: [
      { days: 'Segunda a Sexta', time: '9h às 18h' },
      { days: 'Sábado', time: '9h às 13h' },
      { days: 'Domingo e Feriados', time: 'Fechado' },
    ],
    mapsUrl: 'https://maps.google.com/?q=Praça+Nereu+Ramos+364+Criciuma+SC',
    image: '/images/stores/loja-centro.jpg',
    features: ['Estacionamento próximo', 'Wi-Fi grátis', 'Instalação de película'],
    description: 'Nossa loja principal, localizada no coração de Criciúma. Amplo estoque e atendimento especializado.',
  },
  {
    id: 'marechal',
    name: 'Loja Marechal',
    address: 'Rua Marechal Deodoro, 195',
    neighborhood: 'Centro',
    city: 'Criciúma',
    state: 'SC',
    zipCode: '88801-110',
    phone: '(48) 3045-6044',
    whatsapp: '5548991832760',
    hours: [
      { days: 'Segunda a Sexta', time: '9h às 18h' },
      { days: 'Sábado', time: '9h às 13h' },
      { days: 'Domingo e Feriados', time: 'Fechado' },
    ],
    mapsUrl: 'https://maps.google.com/?q=Rua+Marechal+Deodoro+195+Criciuma+SC',
    image: '/images/stores/loja-marechal.jpg',
    features: ['Fácil acesso', 'Estoque completo', 'Assistência técnica'],
    description: 'Localizada em uma das principais ruas comerciais de Criciúma, com fácil acesso e estacionamento.',
  },
];

export default function LojasPage() {
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
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
                <Store className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text">
                  Nossas Lojas
                </h1>
                <p className="text-text-secondary">
                  Visite uma de nossas lojas em Criciúma/SC
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Store Selector */}
      <section className="py-8 bg-surface border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl whitespace-nowrap transition-all
                  ${selectedStore.id === store.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-white border border-border hover:border-primary'}`}
              >
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{store.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Store Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Store Info */}
            <motion.div
              key={selectedStore.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-text mb-2">{selectedStore.name}</h2>
                <p className="text-text-secondary mb-6">{selectedStore.description}</p>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text">{selectedStore.address}</p>
                      <p className="text-text-secondary">
                        {selectedStore.neighborhood}, {selectedStore.city}/{selectedStore.state}
                      </p>
                      <p className="text-text-secondary">CEP {selectedStore.zipCode}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <a 
                        href={`tel:${selectedStore.phone.replace(/\D/g, '')}`}
                        className="font-medium text-text hover:text-primary transition-colors"
                      >
                        {selectedStore.phone}
                      </a>
                      <p className="text-text-secondary text-sm">Ligação ou WhatsApp</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-text mb-2">Horário de Funcionamento</p>
                      <div className="space-y-1">
                        {selectedStore.hours.map((h, i) => (
                          <div key={i} className="flex justify-between text-sm gap-4">
                            <span className="text-text-secondary">{h.days}</span>
                            <span className={h.time === 'Fechado' ? 'text-red-500' : 'text-text'}>
                              {h.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="font-medium text-text mb-3">Diferenciais</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStore.features.map((feature, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={selectedStore.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
                  >
                    <Navigation className="w-5 h-5" />
                    Como Chegar
                  </a>
                  <a
                    href={`https://wa.me/${selectedStore.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              key={`map-${selectedStore.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-border overflow-hidden h-[400px]">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${selectedStore.address}, ${selectedStore.city} ${selectedStore.state}`
                  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Store Image Placeholder */}
              <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl border border-border p-8 text-center">
                <Store className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="text-text-secondary">
                  Visite nossa loja e conheça todo o nosso estoque pessoalmente!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-text mb-4">
              Prefere comprar online?
            </h2>
            <p className="text-text-secondary mb-8">
              Aproveite nossa loja virtual com entrega para todo o Brasil. 
              Frete grátis para compras acima de R$ 199!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
            >
              Ver Produtos
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
