'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCartStore } from '@/store';
import { formatPrice, cn } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total, totalItems, subtotal, shippingCost } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const cartTotal = total();
  const cartSubtotal = subtotal();
  const cartShipping = shippingCost();
  const discount = couponApplied ? cartSubtotal * 0.1 : 0;
  const finalTotal = cartTotal - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'uss10') {
      setCouponApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-text-secondary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-text-secondary mb-8">
              Adicione produtos ao seu carrinho para continuar comprando.
            </p>
            <Link href="/products">
              <Button>
                Explorar produtos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Carrinho de Compras</h1>
          <p className="text-text-secondary">{totalItems()} itens no carrinho</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.id}-${item.variantInfo || ''}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4 p-4 bg-surface rounded-xl border border-border"
              >
                {/* Image */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/products/${item.product.id}`}
                    className="font-medium hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  {item.variantInfo && (
                    <p className="text-sm text-text-secondary mt-1">
                      Variante: {item.variantInfo}
                    </p>
                  )}
                  <p className="text-primary font-semibold mt-2">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-text-secondary hover:text-error transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-background hover:bg-background-secondary flex items-center justify-center transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-background hover:bg-background-secondary flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-sm text-text-secondary hover:text-error transition-colors"
            >
              Limpar carrinho
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Resumo do Pedido</h2>

              {/* Coupon */}
              <div className="space-y-2">
                <label className="text-sm text-text-secondary">
                  Cupom de desconto
                </label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código do cupom"
                    disabled={couponApplied}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    Aplicar
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-success">
                    Cupom aplicado! 10% de desconto.
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Desconto</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Frete</span>
                  <span>
                    {cartShipping === 0 ? (
                      <span className="text-success">Grátis</span>
                    ) : (
                      formatPrice(cartShipping)
                    )}
                  </span>
                </div>
                {cartSubtotal < 299 && (
                  <p className="text-xs text-text-secondary">
                    Frete grátis em compras acima de R$ 299,00
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full">
                  Finalizar Compra
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link 
                href="/products"
                className="block text-center text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
