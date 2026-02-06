'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/ui';
import { useCartStore } from '@/store';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const discount = product.comparePrice 
    ? calculateDiscount(Number(product.price), Number(product.comparePrice)) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success('Produto adicionado ao carrinho!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="group card-hover relative overflow-hidden">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="brand">Novo</Badge>
            )}
            {discount > 0 && (
              <Badge variant="error">-{discount}%</Badge>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-background-secondary/80 backdrop-blur rounded-lg hover:bg-primary hover:text-white transition-all">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 bg-background-secondary/80 backdrop-blur rounded-lg hover:bg-primary hover:text-white transition-all">
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Image */}
          <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-background-secondary">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl font-bold text-text-muted opacity-20">
                  {product.name.charAt(0)}
                </div>
              </div>
            )}
          </div>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              {product.brand.name}
            </p>
          )}

          {/* Name */}
          <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-text-secondary line-clamp-1 mb-3">
              {product.shortDescription}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-primary">
              {formatPrice(Number(product.price))}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(Number(product.comparePrice))}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-primary text-white rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-primary-hover"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Adicionar</span>
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
