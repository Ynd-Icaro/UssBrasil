'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, Loader2, Plus, Trash2, Upload, 
  Package, DollarSign, Palette, Settings, 
  Calculator, Tag, Save, ChevronDown, Image as ImageIcon,
  Eye, Layers, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Badge } from '@/components/ui';
import api from '@/lib/api';
import { Product, Category, Brand } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import PriceCalculator from './PriceCalculator';
import ProductVariationsModal from './ProductVariationsModal';
import ProductPreviewModal from './ProductPreviewModal';

// Validation Schema
const productSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  slug: z.string().min(2, 'Slug é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0, 'Preço inválido'),
  comparePrice: z.coerce.number().optional().nullable(),
  costPrice: z.coerce.number().optional().nullable(),
  discountPercent: z.coerce.number().min(0).max(100).optional().nullable(),
  sku: z.string().optional(),
  ncm: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.coerce.number().min(0, 'Estoque inválido'),
  lowStockAlert: z.coerce.number().min(0).optional(),
  weight: z.coerce.number().optional().nullable(),
  width: z.coerce.number().optional().nullable(),
  height: z.coerce.number().optional().nullable(),
  length: z.coerce.number().optional().nullable(),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  brandId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  isWavePro: z.boolean().default(false),
  condition: z.string().optional(),
  warranty: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

// Definição de todos os campos do formulário
const formFields = {
  general: [
    { name: 'name', label: 'Nome do Produto', type: 'text', required: true, placeholder: 'iPhone 15 Pro Max' },
    { name: 'slug', label: 'Slug (URL)', type: 'text', required: true, placeholder: 'iphone-15-pro-max' },
    { name: 'shortDescription', label: 'Descrição Curta', type: 'text', placeholder: 'Descrição breve do produto' },
    { name: 'description', label: 'Descrição Completa', type: 'textarea', required: true, placeholder: 'Descrição detalhada do produto...' },
    { name: 'categoryId', label: 'Categoria', type: 'select', required: true, optionsKey: 'categories' },
    { name: 'brandId', label: 'Marca', type: 'select', optionsKey: 'brands' },
  ],
  pricing: [
    { name: 'price', label: 'Preço de Venda (R$)', type: 'number', required: true, placeholder: '0.00' },
    { name: 'comparePrice', label: 'Preço Comparativo (R$)', type: 'number', placeholder: '0.00' },
    { name: 'costPrice', label: 'Preço de Custo (R$)', type: 'number', placeholder: '0.00' },
    { name: 'discountPercent', label: 'Desconto (%)', type: 'number', placeholder: '0' },
  ],
  inventory: [
    { name: 'sku', label: 'SKU', type: 'text', placeholder: 'SKU-001' },
    { name: 'ncm', label: 'NCM', type: 'text', placeholder: '8517.12.90' },
    { name: 'barcode', label: 'Código de Barras', type: 'text', placeholder: '7891234567890' },
    { name: 'stock', label: 'Estoque', type: 'number', required: true, placeholder: '0' },
    { name: 'lowStockAlert', label: 'Alerta de Estoque Baixo', type: 'number', placeholder: '5' },
  ],
  dimensions: [
    { name: 'weight', label: 'Peso (kg)', type: 'number', placeholder: '0.00' },
    { name: 'width', label: 'Largura (cm)', type: 'number', placeholder: '0' },
    { name: 'height', label: 'Altura (cm)', type: 'number', placeholder: '0' },
    { name: 'length', label: 'Comprimento (cm)', type: 'number', placeholder: '0' },
  ],
  status: [
    { name: 'isActive', label: 'Produto Ativo', type: 'checkbox' },
    { name: 'isFeatured', label: 'Destaque', type: 'checkbox' },
    { name: 'isNew', label: 'Novo', type: 'checkbox' },
    { name: 'isWavePro', label: 'WavePro', type: 'checkbox' },
  ],
  extra: [
    { name: 'condition', label: 'Condição', type: 'select', options: [
      { value: 'new', label: 'Novo' },
      { value: 'used', label: 'Usado' },
      { value: 'refurbished', label: 'Recondicionado' },
    ]},
    { name: 'warranty', label: 'Garantia', type: 'text', placeholder: '12 meses' },
  ],
};

const tabs = [
  { id: 'general', label: 'Geral', icon: Package },
  { id: 'pricing', label: 'Preços', icon: DollarSign },
  { id: 'inventory', label: 'Estoque', icon: Tag },
  { id: 'dimensions', label: 'Dimensões', icon: Settings },
  { id: 'variations', label: 'Variações', icon: Layers },
  { id: 'images', label: 'Imagens', icon: ImageIcon },
];

export default function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<{ url: string; alt?: string; isMain: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Novos estados para variações e preview
  const [variants, setVariants] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [showVariationsModal, setShowVariationsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [priceInDollar, setPriceInDollar] = useState<number | undefined>(undefined);
  const [calculatedPriceData, setCalculatedPriceData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      isNew: true,
      isWavePro: false,
      stock: 0,
      price: 0,
      lowStockAlert: 5,
      condition: 'new',
    },
  });

  const name = watch('name');
  const price = watch('price');
  const costPrice = watch('costPrice');
  const discountPercent = watch('discountPercent');

  // Calculate prices
  const calculatedPrices = {
    finalPrice: price ? price * (1 - (discountPercent || 0) / 100) : 0,
    profit: price && costPrice ? (price * (1 - (discountPercent || 0) / 100)) - costPrice : 0,
    profitMargin: price && costPrice && price > 0 
      ? (((price * (1 - (discountPercent || 0) / 100)) - costPrice) / (price * (1 - (discountPercent || 0) / 100))) * 100 
      : 0,
  };

  // Load categories and brands
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Load product data when editing
  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: Number(product.price) || 0,
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        discountPercent: product.discountPercent ? Number(product.discountPercent) : null,
        sku: product.sku || '',
        ncm: product.ncm || '',
        barcode: product.barcode || '',
        stock: product.stock || 0,
        lowStockAlert: product.lowStockAlert || 5,
        weight: product.weight ? Number(product.weight) : null,
        width: product.width ? Number(product.width) : null,
        height: product.height ? Number(product.height) : null,
        length: product.length ? Number(product.length) : null,
        categoryId: product.categoryId || '',
        brandId: product.brandId || null,
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        isNew: product.isNew ?? true,
        isWavePro: product.isWavePro ?? false,
        condition: product.condition || 'new',
        warranty: product.warranty || '',
      });
      setImages(product.images?.map(img => ({
        url: img.url,
        alt: img.alt,
        isMain: img.isMain,
      })) || []);
    } else if (!product && isOpen) {
      reset({
        isActive: true,
        isFeatured: false,
        isNew: true,
        isWavePro: false,
        stock: 0,
        price: 0,
        lowStockAlert: 5,
        condition: 'new',
      });
      setImages([]);
    }
  }, [product, isOpen, reset]);

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !product) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [name, setValue, product]);

  async function loadData() {
    try {
      setIsLoading(true);
      const [categoriesRes, brandsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/brands'),
      ]);
      setCategories(categoriesRes.data.data || []);
      setBrands(brandsRes.data.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Image upload with base64 fallback
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploadingImage(true);
    
    try {
      for (const file of Array.from(files)) {
        // Try API upload first
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          const imageUrl = response.data?.data?.url || response.data?.url;
          if (imageUrl) {
            setImages(prev => [
              ...prev,
              { url: imageUrl, alt: file.name, isMain: prev.length === 0 },
            ]);
            continue;
          }
        } catch (uploadError) {
          console.warn('API upload failed, using base64 fallback');
        }
        
        // Fallback to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setImages(prev => [
            ...prev,
            { url: base64, alt: file.name, isMain: prev.length === 0 },
          ]);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length > 0 && !newImages.some(img => img.isMain)) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isMain: i === index })));
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        images: images.map((img, index) => ({
          url: img.url,
          alt: img.alt || data.name,
          position: index,
          isMain: img.isMain,
        })),
      };

      if (product) {
        await api.patch(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Erro ao salvar produto');
    } finally {
      setIsSaving(false);
    }
  };

  const getSelectOptions = (optionsKey: string) => {
    if (optionsKey === 'categories') return categories;
    if (optionsKey === 'brands') return brands;
    return [];
  };

  const renderField = (field: any) => {
    const error = errors[field.name as keyof ProductFormData];
    
    if (field.type === 'select' && field.optionsKey) {
      const options = getSelectOptions(field.optionsKey);
      return (
        <div key={field.name} className="space-y-1">
          <label className="text-sm font-medium text-text-primary">
            {field.label} {field.required && <span className="text-error">*</span>}
          </label>
          <select
            {...register(field.name as keyof ProductFormData)}
            className={cn(
              "w-full px-3 py-2 border rounded-lg bg-white text-text-primary",
              "focus:ring-2 focus:ring-primary focus:border-primary",
              error ? "border-error" : "border-border"
            )}
          >
            <option value="">Selecione...</option>
            {options.map((opt: any) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
          {error && <p className="text-xs text-error">{error.message}</p>}
        </div>
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.name} className="space-y-1">
          <label className="text-sm font-medium text-text-primary">{field.label}</label>
          <select
            {...register(field.name as keyof ProductFormData)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {field.options.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <label key={field.name} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register(field.name as keyof ProductFormData)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm">{field.label}</span>
        </label>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="space-y-1 col-span-2">
          <label className="text-sm font-medium text-text-primary">
            {field.label} {field.required && <span className="text-error">*</span>}
          </label>
          <textarea
            {...register(field.name as keyof ProductFormData)}
            placeholder={field.placeholder}
            rows={4}
            className={cn(
              "w-full px-3 py-2 border rounded-lg bg-white resize-none",
              "focus:ring-2 focus:ring-primary focus:border-primary",
              error ? "border-error" : "border-border"
            )}
          />
          {error && <p className="text-xs text-error">{error.message}</p>}
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-1">
        <label className="text-sm font-medium text-text-primary">
          {field.label} {field.required && <span className="text-error">*</span>}
        </label>
        <input
          type={field.type}
          step={field.type === 'number' ? '0.01' : undefined}
          {...register(field.name as keyof ProductFormData)}
          placeholder={field.placeholder}
          className={cn(
            "w-full px-3 py-2 border rounded-lg bg-white",
            "focus:ring-2 focus:ring-primary focus:border-primary",
            error ? "border-error" : "border-border"
          )}
        />
        {error && <p className="text-xs text-error">{error.message}</p>}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">
              {product ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* General Tab */}
                {activeTab === 'general' && (
                  <div className="grid grid-cols-2 gap-4">
                    {formFields.general.map(renderField)}
                    <div className="col-span-2 grid grid-cols-4 gap-4 pt-4 border-t border-border">
                      {formFields.status.map(renderField)}
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      {formFields.extra.map(renderField)}
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {formFields.pricing.map(renderField)}
                      
                      {/* Campo de preço em dólar */}
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-text-primary">
                          Preço em Dólar (USD)
                        </label>
                        <input
                          type="number"
                          value={priceInDollar || ''}
                          onChange={(e) => setPriceInDollar(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary border-border"
                        />
                        <p className="text-xs text-text-tertiary">Opcional - para produtos importados</p>
                      </div>
                    </div>
                    
                    {/* Calculadora de Preços Avançada */}
                    <PriceCalculator 
                      costPrice={costPrice || 0}
                      priceInDollar={priceInDollar}
                      onPriceCalculated={(data) => setCalculatedPriceData(data)}
                    />

                    {/* Preços Calculados Simples */}
                    <div className="bg-surface rounded-xl p-4 space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Resumo de Preços (com desconto aplicado)
                      </h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-text-secondary">Preço Final</p>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(calculatedPrices.finalPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Lucro</p>
                          <p className={cn(
                            "text-lg font-bold",
                            calculatedPrices.profit >= 0 ? "text-success" : "text-error"
                          )}>
                            {formatPrice(calculatedPrices.profit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Margem</p>
                          <p className={cn(
                            "text-lg font-bold",
                            calculatedPrices.profitMargin >= 0 ? "text-success" : "text-error"
                          )}>
                            {calculatedPrices.profitMargin.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                  <div className="grid grid-cols-2 gap-4">
                    {formFields.inventory.map(renderField)}
                  </div>
                )}

                {/* Dimensions Tab */}
                {activeTab === 'dimensions' && (
                  <div className="grid grid-cols-2 gap-4">
                    {formFields.dimensions.map(renderField)}
                  </div>
                )}

                {/* Variations Tab */}
                {activeTab === 'variations' && (
                  <div className="space-y-6">
                    <div className="text-center py-8 bg-surface rounded-xl">
                      <Layers className="w-12 h-12 mx-auto text-text-tertiary mb-4" />
                      <h3 className="font-medium text-lg mb-2">Variações do Produto</h3>
                      <p className="text-text-secondary mb-4">
                        Configure cores, tamanhos, capacidades e outras variações
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <Button 
                          type="button"
                          onClick={() => setShowVariationsModal(true)}
                        >
                          <Layers className="w-4 h-4 mr-2" />
                          Gerenciar Variações
                        </Button>
                      </div>
                    </div>

                    {/* Resumo das variações */}
                    {(variants.length > 0 || colors.length > 0) && (
                      <div className="grid grid-cols-2 gap-4">
                        {variants.length > 0 && (
                          <div className="bg-white border border-border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Variações ({variants.length})</h4>
                            <div className="space-y-2">
                              {variants.slice(0, 3).map((v, i) => (
                                <div key={i} className="text-sm text-text-secondary">
                                  {v.name} - Estoque: {v.stock}
                                </div>
                              ))}
                              {variants.length > 3 && (
                                <p className="text-xs text-text-tertiary">
                                  +{variants.length - 3} mais...
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {colors.length > 0 && (
                          <div className="bg-white border border-border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Cores ({colors.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {colors.map((c, i) => (
                                <div 
                                  key={i} 
                                  className="w-8 h-8 rounded-full border-2 border-border"
                                  style={{ backgroundColor: c.hexCode || '#ccc' }}
                                  title={c.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                  <div className="space-y-4">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className={cn(
                        "w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                        "hover:border-primary hover:bg-primary/5",
                        isUploadingImage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      )}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-text-secondary" />
                          <p className="font-medium">Clique para adicionar imagens</p>
                          <p className="text-sm text-text-secondary">PNG, JPG, WebP até 5MB</p>
                        </>
                      )}
                    </button>

                    {images.length > 0 && (
                      <div className="grid grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className={cn(
                              "relative aspect-square rounded-lg overflow-hidden border-2",
                              image.isMain ? "border-primary" : "border-border"
                            )}
                          >
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {!image.isMain && (
                                <button
                                  type="button"
                                  onClick={() => setMainImage(index)}
                                  className="p-2 bg-white rounded-lg text-primary"
                                  title="Definir como principal"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-2 bg-white rounded-lg text-error"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {image.isMain && (
                              <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-surface">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPreviewModal(true)}
              disabled={!name}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {product ? 'Salvar Alterações' : 'Criar Produto'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ProductVariationsModal 
        isOpen={showVariationsModal}
        onClose={() => setShowVariationsModal(false)}
        productName={name || 'Produto'}
        basePrice={price || 0}
        variants={variants}
        colors={colors}
        onSave={(newVariants, newColors) => {
          setVariants(newVariants);
          setColors(newColors);
        }}
      />

      <ProductPreviewModal 
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        product={{
          name: name || 'Produto sem nome',
          description: watch('description') || '',
          shortDescription: watch('shortDescription'),
          price: price || 0,
          comparePrice: watch('comparePrice') || undefined,
          discountPercent: discountPercent || undefined,
          images: images,
          stock: watch('stock') || 0,
          isNew: watch('isNew'),
          isFeatured: watch('isFeatured'),
          warranty: watch('warranty'),
          condition: watch('condition'),
          category: categories.find(c => c.id === watch('categoryId')),
          brand: brands.find(b => b.id === watch('brandId')),
          colors: colors,
          variants: variants,
        }}
      />
    </AnimatePresence>
  );
}
