'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Brand {
  id?: string;
  name: string;
  logoUrl?: string;
  slug?: string;
}

interface BrandsSectionProps {
  brands?: Brand[];
  isLoading?: boolean;
}

const defaultBrands: Brand[] = [
  { name: 'Apple', slug: 'apple' },
  { name: 'DJI', slug: 'dji' },
  { name: 'JBL', slug: 'jbl' },
  { name: 'Xiaomi', slug: 'xiaomi' },
  { name: 'WavePro', slug: 'wavepro' },
  { name: 'Geonav', slug: 'geonav' },
  { name: 'Baseus', slug: 'baseus' },
];

export default function BrandsSection({ brands, isLoading = false }: BrandsSectionProps) {
  const displayBrands = brands && brands.length > 0 ? brands : defaultBrands;

  return (
    <section className="py-12 border-y border-border bg-surface overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16"
        >
          {displayBrands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer"
            >
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={100}
                  height={40}
                  className="h-8 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
              ) : (
                <span 
                  className={`text-xl md:text-2xl font-black transition-all duration-300 ${
                    brand.name === 'WavePro' 
                      ? 'text-primary' 
                      : 'text-text-muted/40 hover:text-primary'
                  }`}
                >
                  {brand.name}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
