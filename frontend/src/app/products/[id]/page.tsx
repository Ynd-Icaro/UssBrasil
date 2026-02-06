'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check
} from 'lucide-react';
import { Button, Badge, Skeleton } from '@/components/ui';
import { ProductGrid, ShippingCalculator } from '@/components/products';
import api from '@/lib/api';
import { Product } from '@/types';
import { useCartStore } from '@/store';
import { formatPrice, cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const response = await api.get(`/products/${params.id}`);
        const productData = response.data.data;
        setProduct(productData);
        
        if (productData.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }

        // Load related products
        const relatedResponse = await api.get(`/products?categoryId=${productData.categoryId}&limit=4`);
        const related = relatedResponse.data.data.data.filter(
          (p: Product) => p.id !== productData.id
        );
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product, quantity, selectedVariant || undefined);
    
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Produto não encontrado</h1>
          <p className="text-text-secondary">O produto que você procura não existe.</p>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images.map(img => img.url) : ['/placeholder.jpg'];
  const discountPercent = product.comparePrice 
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary mb-8">
          <a href="/" className="hover:text-text-primary">Home</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-text-primary">Produtos</a>
          <span className="mx-2">/</span>
          {product.category && (
            <>
              <a 
                href={`/categories/${product.category.slug}`}
                className="hover:text-text-primary"
              >
                {product.category.name}
              </a>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-surface rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => 
                      prev === 0 ? images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => 
                      prev === images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <Badge variant="error">-{discountPercent}%</Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="secondary">Esgotado</Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors',
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-border'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <p className="text-primary font-medium">{product.brand.name}</p>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const avgRating = product.reviews?.length 
                    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length 
                    : 0;
                  return (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(avgRating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-border'
                      )}
                    />
                  );
                })}
              </div>
              <span className="text-text-secondary">
                ({product.reviews?.length || 0} avaliações)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-text-secondary line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-text-secondary">{product.shortDescription}</p>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Variante
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.name)}
                      className={cn(
                        'px-4 py-2 rounded-lg border transition-colors',
                        selectedVariant === variant.name
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary'
                      )}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quantidade
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                  className="w-10 h-10 rounded-lg bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors"
                  disabled={quantity >= (product.stock || 10)}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-text-secondary">
                  {product.stock} em estoque
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                {isAddedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Adicionar ao carrinho
                  </>
                )}
              </Button>
              <button className="w-12 h-12 rounded-lg bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-lg bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Frete Grátis</p>
                <p className="text-xs text-text-secondary">Acima de R$ 299</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Garantia</p>
                <p className="text-xs text-text-secondary">12 meses</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Troca Grátis</p>
                <p className="text-xs text-text-secondary">Em até 30 dias</p>
              </div>
            </div>

            {/* Shipping Calculator */}
            <div className="pt-6 border-t border-border">
              <ShippingCalculator 
                productValue={product.price}
                productWeight={product.weight || 0.5}
                productDimensions={product.dimensions || { width: 20, height: 5, length: 15 }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-8 border-b border-border mb-8">
            {[
              { key: 'description', label: 'Descrição' },
              { key: 'specs', label: 'Especificações' },
              { key: 'reviews', label: `Avaliações (${product.reviews?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={cn(
                  'pb-4 font-medium transition-colors relative',
                  activeTab === tab.key
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === 'description' && (
              <div className="space-y-8">
                {/* Main Description Box */}
                <div className="bg-surface rounded-2xl border border-border p-8">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Sobre o Produto</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-text-secondary whitespace-pre-line leading-relaxed">
                      {product.description || 'Nenhuma descrição disponível.'}
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                {product.shortDescription && (
                  <div className="bg-surface rounded-2xl border border-border p-8">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Destaques</h3>
                    <p className="text-text-secondary">{product.shortDescription}</p>
                  </div>
                )}

                {/* Product Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-surface rounded-2xl border border-border p-6">
                    <h4 className="font-semibold mb-3 text-foreground">Informações</h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <dt className="text-text-muted">SKU</dt>
                        <dd className="font-medium text-foreground">{product.sku || 'N/A'}</dd>
                      </div>
                      {product.brand && (
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <dt className="text-text-muted">Marca</dt>
                          <dd className="font-medium text-primary">{product.brand.name}</dd>
                        </div>
                      )}
                      {product.category && (
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <dt className="text-text-muted">Categoria</dt>
                          <dd className="font-medium text-foreground">{product.category.name}</dd>
                        </div>
                      )}
                      <div className="flex justify-between py-2">
                        <dt className="text-text-muted">Disponibilidade</dt>
                        <dd className={cn(
                          "font-medium",
                          product.stock > 0 ? "text-success" : "text-error"
                        )}>
                          {product.stock > 0 ? `${product.stock} em estoque` : 'Indisponível'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-surface rounded-2xl border border-border p-6">
                    <h4 className="font-semibold mb-3 text-foreground">Garantia e Suporte</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-text-secondary">
                        <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Garantia de 12 meses contra defeitos</span>
                      </li>
                      <li className="flex items-center gap-3 text-text-secondary">
                        <RotateCcw className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>30 dias para troca ou devolução</span>
                      </li>
                      <li className="flex items-center gap-3 text-text-secondary">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Produto 100% original</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4">
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((variant) => (
                    <div 
                      key={variant.id}
                      className="flex justify-between py-3 border-b border-border"
                    >
                      <span className="text-text-secondary">{variant.name}</span>
                      <span className="font-medium">
                        {variant.stock > 0 ? `${variant.stock} disponível` : 'Indisponível'}
                        {variant.price && ` (${formatPrice(variant.price)})`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-text-secondary">
                    Nenhuma especificação disponível.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <p className="text-text-secondary">
                  As avaliações serão exibidas aqui.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Produtos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
