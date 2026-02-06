'use client';

import { useState } from 'react';
import { X, ShoppingCart, Heart, Share2, Star, Package, Truck, Shield, ChevronLeft, ChevronRight, Minus, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '@/lib/utils';
import { formatBRL } from '@/lib/pricing';

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    discountPercent?: number;
    images: { url: string; alt?: string; isMain?: boolean }[];
    stock: number;
    isNew?: boolean;
    isFeatured?: boolean;
    warranty?: string;
    condition?: string;
    category?: { name: string };
    brand?: { name: string };
    colors?: { name: string; hexCode?: string; stock: number }[];
    variants?: { name: string; options?: Record<string, string>; price?: number; stock: number }[];
    specifications?: Record<string, string>;
    maxInstallments?: number;
    maxInstallmentsNoFee?: number;
  };
}

export default function ProductPreviewModal({ isOpen, onClose, product }: ProductPreviewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0]?.name || null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const mainImage = product.images?.[selectedImage]?.url || '/placeholder.png';
  const finalPrice = product.discountPercent 
    ? product.price * (1 - product.discountPercent / 100) 
    : product.price;
  
  const maxInstallments = product.maxInstallments || 12;
  const noFeeInstallments = product.maxInstallmentsNoFee || 3;
  const installmentValue = finalPrice / maxInstallments;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % (product.images?.length || 1));
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Preview
              </span>
              <span>Visualização como cliente</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-60px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Galeria de Imagens */}
              <div className="space-y-4">
                {/* Imagem Principal */}
                <div 
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in",
                    isZoomed && "cursor-zoom-out"
                  )}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  {product.images && product.images.length > 0 ? (
                    <motion.img
                      key={selectedImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={mainImage}
                      alt={product.images[selectedImage]?.alt || product.name}
                      className={cn(
                        "w-full h-full object-contain transition-transform duration-300",
                        isZoomed && "scale-150"
                      )}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                      <Package className="w-24 h-24 opacity-30" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        NOVO
                      </span>
                    )}
                    {product.discountPercent && product.discountPercent > 0 && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        -{product.discountPercent}%
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        DESTAQUE
                      </span>
                    )}
                  </div>

                  {/* Navegação */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Ações */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                          selectedImage === index
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent hover:border-gray-300"
                        )}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações do Produto */}
              <div className="space-y-6">
                {/* Header */}
                <div>
                  {(product.category || product.brand) && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                      {product.brand && <span className="font-medium">{product.brand.name}</span>}
                      {product.brand && product.category && <span>•</span>}
                      {product.category && <span>{product.category.name}</span>}
                    </div>
                  )}
                  <h1 className="text-2xl lg:text-3xl font-bold text-text-primary leading-tight">
                    {product.name}
                  </h1>
                  
                  {/* Reviews */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={cn(
                            "w-4 h-4",
                            star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          )} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-text-secondary">(0 avaliações)</span>
                  </div>
                </div>

                {/* Preço */}
                <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4">
                  <div className="flex items-baseline gap-3">
                    {product.comparePrice && (
                      <span className="text-lg text-text-tertiary line-through">
                        {formatBRL(product.comparePrice)}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-primary">
                      {formatBRL(finalPrice)}
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    em até <strong>{maxInstallments}x</strong> de{' '}
                    <strong>{formatBRL(installmentValue)}</strong>
                    {noFeeInstallments >= maxInstallments && (
                      <span className="text-green-600 ml-1">sem juros</span>
                    )}
                  </div>
                  <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    ou {formatBRL(finalPrice * 0.95)} à vista no Pix (5% off)
                  </div>
                </div>

                {/* Descrição curta */}
                {product.shortDescription && (
                  <p className="text-text-secondary">{product.shortDescription}</p>
                )}

                {/* Cores */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-primary">Cor</span>
                      <span className="text-sm text-text-secondary">{selectedColor}</span>
                    </div>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all",
                            selectedColor === color.name
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-gray-200 hover:border-gray-300",
                            color.stock === 0 && "opacity-50"
                          )}
                          style={{ backgroundColor: color.hexCode || '#ccc' }}
                          title={color.name}
                          disabled={color.stock === 0}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Variações */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3">
                    <span className="font-medium text-text-primary">Versão</span>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.name}
                          onClick={() => setSelectedVariant(variant.name)}
                          className={cn(
                            "p-3 rounded-lg border-2 text-left transition-all",
                            selectedVariant === variant.name
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300",
                            variant.stock === 0 && "opacity-50"
                          )}
                          disabled={variant.stock === 0}
                        >
                          <div className="font-medium text-sm">
                            {variant.options 
                              ? Object.values(variant.options).join(' / ')
                              : variant.name
                            }
                          </div>
                          {variant.price && (
                            <div className="text-primary font-bold mt-1">
                              {formatBRL(variant.price)}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantidade */}
                <div className="space-y-3">
                  <span className="font-medium text-text-primary">Quantidade</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-text-secondary">
                      {product.stock > 0 
                        ? `${product.stock} unidades disponíveis`
                        : 'Sem estoque'
                      }
                    </span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3">
                  <button 
                    className={cn(
                      "flex-1 py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all",
                      product.stock > 0
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-gray-300 cursor-not-allowed"
                    )}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </button>
                  <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Benefícios */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Truck className="w-5 h-5 mx-auto text-primary mb-1" />
                    <span className="text-xs text-text-secondary">Frete Grátis</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 mx-auto text-primary mb-1" />
                    <span className="text-xs text-text-secondary">
                      {product.warranty || 'Garantia'}
                    </span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Package className="w-5 h-5 mx-auto text-primary mb-1" />
                    <span className="text-xs text-text-secondary capitalize">
                      {product.condition === 'new' ? 'Novo' : product.condition}
                    </span>
                  </div>
                </div>

                {/* Especificações */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-semibold mb-3">Especificações</h3>
                    <div className="space-y-2">
                      {Object.entries(product.specifications).slice(0, 5).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-text-secondary">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Descrição */}
                {product.description && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-semibold mb-3">Descrição</h3>
                    <p className="text-sm text-text-secondary whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
