'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Upload, X, Loader2, Plus, Trash2, ArrowLeft, 
  Package, DollarSign, Palette, Settings, 
  Calculator, Tag, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Badge } from '@/components/ui';
import api from '@/lib/api';
import { Category, Brand, ProductColor, ProductVariant, Product } from '@/types';
import { cn, formatPrice } from '@/lib/utils';

// Validation Schema
const productSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  slug: z.string().min(2, 'Slug é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0, 'Preço inválido'),
  comparePrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  suggestedPrice: z.coerce.number().optional(),
  originalPrice: z.coerce.number().optional(),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  stripeDiscount: z.coerce.number().min(0).max(100).optional(),
  sku: z.string().optional(),
  ncm: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.coerce.number().min(0, 'Estoque inválido'),
  lowStockAlert: z.coerce.number().min(0).optional(),
  hasVariations: z.boolean().default(false),
  weight: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  brandId: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  isPreOrder: z.boolean().default(false),
  isWavePro: z.boolean().default(false),
  condition: z.string().optional(),
  warranty: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const isEditing = productId !== 'new';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<{ url: string; alt?: string; isMain: boolean }[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [storageOptions, setStorageOptions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'inventory' | 'colors' | 'variations' | 'seo'>('general');
  const [showVariationsModal, setShowVariationsModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [calculatedPrices, setCalculatedPrices] = useState({
    discountPrice: 0,
    stripeFinalPrice: 0,
    finalPrice: 0,
    markup: 0,
    profitMargin: 0,
    profitValue: 0,
  });
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const colorImageInputRef = useRef<HTMLInputElement>(null);
  
  const [newTag, setNewTag] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newStorage, setNewStorage] = useState('');
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
  const [newColor, setNewColor] = useState<ProductColor>({
    name: '',
    hexCode: '#000000',
    images: [],
    stock: 0,
    priceModifier: 0,
    isDefault: false,
  });
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    name: '',
    sku: '',
    ncm: '',
    options: {},
    price: undefined,
    priceAdjustment: 0,
    stock: 0,
    serialNumbers: [],
    isActive: true,
  });
  const [newSerialNumber, setNewSerialNumber] = useState('');
  
  const {
    register,
    handleSubmit,
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
      isPreOrder: false,
      isWavePro: false,
      hasVariations: false,
      stock: 0,
      price: 0,
      lowStockAlert: 5,
      condition: 'new',
    },
  });

  const watchedValues = watch(['name', 'price', 'costPrice', 'discountPercent', 'stripeDiscount', 'hasVariations']);
  const name = watchedValues[0];
  const price = watchedValues[1];
  const costPrice = watchedValues[2];
  const discountPercent = watchedValues[3];
  const stripeDiscount = watchedValues[4];
  const hasVariations = watchedValues[5];

  // Load categories, brands, and product data if editing
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [categoriesRes, brandsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands'),
        ]);
        setCategories(categoriesRes.data.data);
        setBrands(brandsRes.data.data);

        if (isEditing) {
          const productRes = await api.get(`/products/${productId}`);
          const product = productRes.data.data as Product;
          
          reset({
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.shortDescription || '',
            price: product.price,
            comparePrice: product.comparePrice,
            costPrice: product.costPrice,
            suggestedPrice: product.suggestedPrice,
            originalPrice: product.originalPrice,
            discountPercent: product.discountPercent,
            stripeDiscount: product.stripeDiscount,
            sku: product.sku || '',
            ncm: product.ncm || '',
            barcode: product.barcode || '',
            stock: product.stock,
            lowStockAlert: product.lowStockAlert || 5,
            hasVariations: product.hasVariations,
            weight: product.weight,
            width: product.width,
            height: product.height,
            length: product.length,
            categoryId: product.categoryId,
            brandId: product.brandId || '',
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            isNew: product.isNew,
            isPreOrder: product.isPreOrder,
            isWavePro: product.isWavePro,
            condition: product.condition || 'new',
            warranty: product.warranty || '',
          });

          setImages(product.images?.map(img => ({
            url: img.url,
            alt: img.alt,
            isMain: img.isMain,
          })) || []);
          setColors(product.colors || []);
          setVariants(product.variants || []);
          setSizes(product.sizes || []);
          setStorageOptions(product.storageOptions || []);
          setTags(product.tags || []);

          if (product.specifications) {
            setSpecifications(
              Object.entries(product.specifications).map(([key, value]) => ({
                key,
                value: String(value),
              }))
            );
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [isEditing, productId, reset]);

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !isEditing) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [name, setValue, isEditing]);

  // Calculate derived prices
  useEffect(() => {
    const priceNum = Number(price) || 0;
    const costPriceNum = Number(costPrice) || 0;
    const discountPercentNum = Number(discountPercent) || 0;
    const stripeDiscountNum = Number(stripeDiscount) || 0;

    const discountPrice = priceNum * (1 - discountPercentNum / 100);
    const stripeFinalPrice = discountPrice * (1 - stripeDiscountNum / 100);
    const finalPrice = stripeFinalPrice;

    let markup = 0;
    let profitMargin = 0;
    let profitValue = 0;

    if (costPriceNum > 0) {
      markup = ((finalPrice - costPriceNum) / costPriceNum) * 100;
      profitMargin = ((finalPrice - costPriceNum) / finalPrice) * 100;
      profitValue = finalPrice - costPriceNum;
    }

    setCalculatedPrices({
      discountPrice: Math.round(discountPrice * 100) / 100,
      stripeFinalPrice: Math.round(stripeFinalPrice * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      markup: Math.round(markup * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      profitValue: Math.round(profitValue * 100) / 100,
    });
  }, [price, costPrice, discountPercent, stripeDiscount]);

  // Auto-calculate stock from variations
  useEffect(() => {
    if (hasVariations && variants.length > 0) {
      const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      setValue('stock', totalStock);
    }
  }, [variants, hasVariations, setValue]);

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isColorImage = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const imageUrl = response.data.data?.url || response.data.url;

        if (isColorImage) {
          setNewColor(prev => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }));
        } else {
          setImages(prev => [
            ...prev,
            { url: imageUrl, alt: file.name, isMain: prev.length === 0 },
          ]);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index]?.isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const setMainImage = (index: number) => {
    setImages(prev =>
      prev.map((img, i) => ({ ...img, isMain: i === index }))
    );
  };

  // Tags
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  // Sizes
  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes(prev => [...prev, newSize.trim()]);
      setNewSize('');
    }
  };

  // Storage Options
  const addStorage = () => {
    if (newStorage.trim() && !storageOptions.includes(newStorage.trim())) {
      setStorageOptions(prev => [...prev, newStorage.trim()]);
      setNewStorage('');
    }
  };

  // Specifications
  const addSpec = () => {
    if (newSpec.key.trim() && newSpec.value.trim()) {
      setSpecifications(prev => [...prev, { ...newSpec }]);
      setNewSpec({ key: '', value: '' });
    }
  };

  // Colors
  const saveColor = () => {
    if (!newColor.name.trim()) {
      alert('Nome da cor é obrigatório');
      return;
    }

    if (editingColorIndex !== null) {
      const updatedColors = [...colors];
      updatedColors[editingColorIndex] = newColor;
      setColors(updatedColors);
    } else {
      setColors(prev => [...prev, { ...newColor, isDefault: prev.length === 0 }]);
    }

    setNewColor({
      name: '',
      hexCode: '#000000',
      images: [],
      stock: 0,
      priceModifier: 0,
      isDefault: false,
    });
    setEditingColorIndex(null);
    setShowColorModal(false);
  };

  const editColor = (index: number) => {
    setNewColor(colors[index]);
    setEditingColorIndex(index);
    setShowColorModal(true);
  };

  const removeColor = (index: number) => {
    setColors(prev => {
      const newColors = prev.filter((_, i) => i !== index);
      if (prev[index]?.isDefault && newColors.length > 0) {
        newColors[0].isDefault = true;
      }
      return newColors;
    });
  };

  // Variants
  const saveVariant = () => {
    if (!newVariant.name.trim()) {
      alert('Nome da variação é obrigatório');
      return;
    }

    if (editingVariantIndex !== null) {
      const updatedVariants = [...variants];
      updatedVariants[editingVariantIndex] = newVariant;
      setVariants(updatedVariants);
    } else {
      setVariants(prev => [...prev, { ...newVariant }]);
    }

    setNewVariant({
      name: '',
      sku: '',
      ncm: '',
      options: {},
      price: undefined,
      priceAdjustment: 0,
      stock: 0,
      serialNumbers: [],
      isActive: true,
    });
    setEditingVariantIndex(null);
    setShowVariationsModal(false);
  };

  const editVariant = (index: number) => {
    setNewVariant(variants[index]);
    setEditingVariantIndex(index);
    setShowVariationsModal(true);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Serial Numbers
  const addSerialNumber = () => {
    if (newSerialNumber.trim() && !newVariant.serialNumbers.includes(newSerialNumber.trim())) {
      setNewVariant(prev => ({
        ...prev,
        serialNumbers: [...prev.serialNumbers, newSerialNumber.trim()],
        stock: prev.serialNumbers.length + 1,
      }));
      setNewSerialNumber('');
    }
  };

  const removeSerialNumber = (sn: string) => {
    setNewVariant(prev => ({
      ...prev,
      serialNumbers: prev.serialNumbers.filter(s => s !== sn),
      stock: Math.max(0, prev.serialNumbers.length - 1),
    }));
  };

  // Form Submit
  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSaving(true);

      const productData = {
        ...data,
        discountPrice: calculatedPrices.discountPrice,
        stripeFinalPrice: calculatedPrices.stripeFinalPrice,
        finalPrice: calculatedPrices.finalPrice,
        markup: calculatedPrices.markup,
        profitMargin: calculatedPrices.profitMargin,
        profitValue: calculatedPrices.profitValue,
        images: images.map((img, index) => ({
          url: img.url,
          alt: img.alt || data.name,
          position: index,
          isMain: img.isMain,
        })),
        colors,
        variants,
        sizes,
        storageOptions,
        tags,
        specifications: specifications.reduce((obj, spec) => {
          obj[spec.key] = spec.value;
          return obj;
        }, {} as Record<string, string>),
      };

      if (isEditing) {
        await api.patch(`/products/${productId}`, productData);
        alert('Produto atualizado com sucesso!');
      } else {
        await api.post('/products', productData);
        alert('Produto criado com sucesso!');
      }

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Erro ao salvar produto.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: Package },
    { id: 'pricing', label: 'Preços', icon: DollarSign },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'colors', label: 'Cores', icon: Palette },
    { id: 'variations', label: 'Variações', icon: Settings },
    { id: 'seo', label: 'SEO/Tags', icon: Tag },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className="text-text-secondary text-sm">
              {isEditing ? 'Atualize os dados do produto' : 'Preencha os dados do produto'}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? 'Atualizar' : 'Salvar'}
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* General Tab */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome *</label>
                    <Input
                      {...register('name')}
                      placeholder="Nome do produto"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug *</label>
                    <Input
                      {...register('slug')}
                      placeholder="slug-do-produto"
                      className={errors.slug ? 'border-red-500' : ''}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Descrição Curta</label>
                  <Input
                    {...register('shortDescription')}
                    placeholder="Breve descrição do produto"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Descrição *</label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className={cn(
                      'w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none',
                      errors.description ? 'border-red-500' : ''
                    )}
                    placeholder="Descrição completa do produto..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria *</label>
                    <select
                      {...register('categoryId')}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Marca</label>
                    <select
                      {...register('brandId')}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    >
                      <option value="">Selecione uma marca</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Imagens do Produto</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden border-2',
                        image.isMain ? 'border-primary' : 'border-border'
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
                            className="px-2 py-1 bg-primary text-white text-xs rounded"
                          >
                            Principal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-500 text-white rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {image.isMain && (
                        <Badge className="absolute top-2 left-2 bg-primary text-white">
                          Principal
                        </Badge>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => mainImageInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-text-secondary" />
                        <span className="text-sm text-text-secondary">Adicionar</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={mainImageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                />
              </div>

              {/* Status */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Status do Produto</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Ativo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isFeatured')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Destaque</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isNew')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Novo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isPreOrder')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Pré-venda</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isWavePro')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">WavePro</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Precificação
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço de Custo (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('costPrice')}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço Sugerido (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('suggestedPrice')}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço Original (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('originalPrice')}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço Base (R$) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('price')}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço "De" (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('comparePrice')}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Desconto (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      {...register('discountPercent')}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Desconto Stripe (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('stripeDiscount')}
                    placeholder="0"
                    className="max-w-xs"
                  />
                </div>
              </div>

              {/* Calculated Values */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Valores Calculados
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-text-secondary">Preço c/ Desconto</p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(calculatedPrices.discountPrice)}
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-text-secondary">Preço Final Stripe</p>
                    <p className="text-xl font-bold text-green-500">
                      {formatPrice(calculatedPrices.stripeFinalPrice)}
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border-2 border-primary">
                    <p className="text-sm text-text-secondary">Preço Final</p>
                    <p className="text-xl font-bold">
                      {formatPrice(calculatedPrices.finalPrice)}
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-text-secondary">Markup</p>
                    <p className={cn(
                      'text-xl font-bold',
                      calculatedPrices.markup >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {calculatedPrices.markup.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-text-secondary">Margem de Lucro</p>
                    <p className={cn(
                      'text-xl font-bold',
                      calculatedPrices.profitMargin >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {calculatedPrices.profitMargin.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-text-secondary">Lucro (R$)</p>
                    <p className={cn(
                      'text-xl font-bold',
                      calculatedPrices.profitValue >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {formatPrice(calculatedPrices.profitValue)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Stock & SKU */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Estoque e Identificação</h2>
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('hasVariations')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Produto com Variações</span>
                  </label>
                  <p className="text-xs text-text-secondary mt-1 ml-6">
                    Marque se o estoque será calculado automaticamente das variações
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SKU</label>
                    <Input {...register('sku')} placeholder="SKU-001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">NCM</label>
                    <Input {...register('ncm')} placeholder="00000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Código de Barras</label>
                    <Input {...register('barcode')} placeholder="7898000000000" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Estoque {hasVariations && '(calculado automaticamente)'}
                    </label>
                    <Input
                      type="number"
                      {...register('stock')}
                      placeholder="0"
                      disabled={hasVariations}
                      className={hasVariations ? 'bg-gray-100 cursor-not-allowed' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Alerta de Estoque Baixo</label>
                    <Input
                      type="number"
                      {...register('lowStockAlert')}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Dimensões e Peso</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Peso (kg)</label>
                    <Input
                      type="number"
                      step="0.001"
                      {...register('weight')}
                      placeholder="0.000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Largura (cm)</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('width')}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Altura (cm)</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('height')}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Comprimento (cm)</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('length')}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Condition & Warranty */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Condição e Garantia</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Condição</label>
                    <select
                      {...register('condition')}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    >
                      <option value="new">Novo</option>
                      <option value="used">Usado</option>
                      <option value="refurbished">Recondicionado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Garantia</label>
                    <Input {...register('warranty')} placeholder="Ex: 12 meses" />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Especificações Técnicas</h2>
                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={spec.key} disabled className="flex-1" />
                      <Input value={spec.value} disabled className="flex-1" />
                      <button
                        type="button"
                        onClick={() => setSpecifications(prev => prev.filter((_, i) => i !== index))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newSpec.key}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="Nome da especificação"
                      className="flex-1"
                    />
                    <Input
                      value={newSpec.value}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Valor"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addSpec} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sizes & Storage */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-surface rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold mb-4">Tamanhos Disponíveis</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sizes.map((size) => (
                      <Badge key={size} variant="secondary" className="flex items-center gap-1">
                        {size}
                        <button
                          type="button"
                          onClick={() => setSizes(prev => prev.filter(s => s !== size))}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Ex: P, M, G, GG"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    />
                    <Button type="button" onClick={addSize} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-surface rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold mb-4">Opções de Armazenamento</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {storageOptions.map((storage) => (
                      <Badge key={storage} variant="secondary" className="flex items-center gap-1">
                        {storage}
                        <button
                          type="button"
                          onClick={() => setStorageOptions(prev => prev.filter(s => s !== storage))}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newStorage}
                      onChange={(e) => setNewStorage(e.target.value)}
                      placeholder="Ex: 128GB, 256GB, 512GB"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStorage())}
                    />
                    <Button type="button" onClick={addStorage} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Cores do Produto
                  </h2>
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingColorIndex(null);
                      setNewColor({
                        name: '',
                        hexCode: '#000000',
                        images: [],
                        stock: 0,
                        priceModifier: 0,
                        isDefault: colors.length === 0,
                      });
                      setShowColorModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Cor
                  </Button>
                </div>

                {colors.length === 0 ? (
                  <p className="text-center text-text-secondary py-8">
                    Nenhuma cor adicionada ainda.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className={cn(
                          'p-4 rounded-lg border-2',
                          color.isDefault ? 'border-primary bg-primary/5' : 'border-border'
                        )}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-border"
                            style={{ backgroundColor: color.hexCode || '#000' }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{color.name}</p>
                            <p className="text-xs text-text-secondary">{color.hexCode}</p>
                          </div>
                          {color.isDefault && (
                            <Badge variant="secondary" className="text-xs">Padrão</Badge>
                          )}
                        </div>
                        <div className="flex gap-2 text-sm text-text-secondary mb-3">
                          <span>Estoque: {color.stock}</span>
                          {color.priceModifier !== 0 && (
                            <span>| {color.priceModifier! > 0 ? '+' : ''}{formatPrice(color.priceModifier || 0)}</span>
                          )}
                        </div>
                        {color.images.length > 0 && (
                          <div className="flex gap-1 mb-3 overflow-x-auto">
                            {color.images.slice(0, 4).map((img, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt=""
                                className="w-12 h-12 rounded object-cover"
                              />
                            ))}
                            {color.images.length > 4 && (
                              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs">
                                +{color.images.length - 4}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => editColor(index)}
                            className="flex-1"
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeColor(index)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Variations Tab */}
          {activeTab === 'variations' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Variações do Produto
                    </h2>
                    <p className="text-sm text-text-secondary">
                      SKU, NCM e números de série individuais para cada variação
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingVariantIndex(null);
                      setNewVariant({
                        name: '',
                        sku: '',
                        ncm: '',
                        options: {},
                        price: undefined,
                        priceAdjustment: 0,
                        stock: 0,
                        serialNumbers: [],
                        isActive: true,
                      });
                      setShowVariationsModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Variação
                  </Button>
                </div>

                {variants.length === 0 ? (
                  <p className="text-center text-text-secondary py-8">
                    Nenhuma variação adicionada ainda.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-3 text-sm font-medium text-text-secondary">Nome</th>
                          <th className="text-left p-3 text-sm font-medium text-text-secondary">SKU</th>
                          <th className="text-left p-3 text-sm font-medium text-text-secondary">NCM</th>
                          <th className="text-right p-3 text-sm font-medium text-text-secondary">Estoque</th>
                          <th className="text-right p-3 text-sm font-medium text-text-secondary">Ajuste Preço</th>
                          <th className="text-center p-3 text-sm font-medium text-text-secondary">Séries</th>
                          <th className="text-right p-3 text-sm font-medium text-text-secondary">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((variant, index) => (
                          <tr key={index} className="border-b border-border last:border-0">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {variant.image && (
                                  <img
                                    src={variant.image}
                                    alt=""
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                )}
                                <span className="font-medium">{variant.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-text-secondary">{variant.sku || '-'}</td>
                            <td className="p-3 text-text-secondary">{variant.ncm || '-'}</td>
                            <td className="p-3 text-right">{variant.stock}</td>
                            <td className="p-3 text-right">
                              {variant.priceAdjustment ? (
                                <span className={variant.priceAdjustment > 0 ? 'text-green-500' : 'text-red-500'}>
                                  {variant.priceAdjustment > 0 ? '+' : ''}{formatPrice(variant.priceAdjustment)}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant="secondary">{variant.serialNumbers.length}</Badge>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editVariant(index)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeVariant(index)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {variants.length > 0 && (
                  <div className="mt-4 p-4 bg-background rounded-lg">
                    <p className="text-sm">
                      <strong>Estoque Total:</strong> {variants.reduce((sum, v) => sum + v.stock, 0)} unidades
                    </p>
                    <p className="text-sm text-text-secondary">
                      Total de números de série: {variants.reduce((sum, v) => sum + v.serialNumbers.length, 0)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags do Produto
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar tag..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Color Modal */}
      <AnimatePresence>
        {showColorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowColorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">
                  {editingColorIndex !== null ? 'Editar Cor' : 'Nova Cor'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da Cor *</label>
                    <Input
                      value={newColor.name}
                      onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Preto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Código Hex</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={newColor.hexCode || '#000000'}
                        onChange={(e) => setNewColor(prev => ({ ...prev, hexCode: e.target.value }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={newColor.hexCode || ''}
                        onChange={(e) => setNewColor(prev => ({ ...prev, hexCode: e.target.value }))}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Estoque</label>
                    <Input
                      type="number"
                      value={newColor.stock}
                      onChange={(e) => setNewColor(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Modificador de Preço (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newColor.priceModifier || 0}
                      onChange={(e) => setNewColor(prev => ({ ...prev, priceModifier: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newColor.isDefault}
                    onChange={(e) => setNewColor(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Cor Padrão</span>
                </label>
                <div>
                  <label className="block text-sm font-medium mb-2">Imagens da Cor</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newColor.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img src={img} alt="" className="w-16 h-16 rounded object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewColor(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => colorImageInputRef.current?.click()}
                      className="w-16 h-16 rounded border-2 border-dashed border-border flex items-center justify-center hover:border-primary"
                    >
                      <Plus className="w-5 h-5 text-text-secondary" />
                    </button>
                  </div>
                  <input
                    ref={colorImageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowColorModal(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={saveColor}>
                  {editingColorIndex !== null ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variations Modal */}
      <AnimatePresence>
        {showVariationsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVariationsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">
                  {editingVariantIndex !== null ? 'Editar Variação' : 'Nova Variação'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Variação *</label>
                  <Input
                    value={newVariant.name}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: iPhone 15 Pro 256GB Preto"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SKU</label>
                    <Input
                      value={newVariant.sku || ''}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
                      placeholder="SKU-VAR-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">NCM</label>
                    <Input
                      value={newVariant.ncm || ''}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, ncm: e.target.value }))}
                      placeholder="00000000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Estoque</label>
                    <Input
                      type="number"
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ajuste de Preço (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newVariant.priceAdjustment || 0}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, priceAdjustment: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVariant.isActive}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Variação Ativa</span>
                </label>

                {/* Serial Numbers Section */}
                <div>
                  <label className="block text-sm font-medium mb-2">Números de Série</label>
                  <p className="text-xs text-text-secondary mb-2">
                    Cada número de série representa uma unidade física em estoque.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto">
                    {newVariant.serialNumbers.map((sn) => (
                      <Badge key={sn} variant="secondary" className="flex items-center gap-1 font-mono text-xs">
                        {sn}
                        <button
                          type="button"
                          onClick={() => removeSerialNumber(sn)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSerialNumber}
                      onChange={(e) => setNewSerialNumber(e.target.value)}
                      placeholder="Digite o número de série"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSerialNumber())}
                      className="font-mono"
                    />
                    <Button type="button" onClick={addSerialNumber} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {newVariant.serialNumbers.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {newVariant.serialNumbers.length} unidade(s) com número de série
                    </p>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-border flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowVariationsModal(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={saveVariant}>
                  {editingVariantIndex !== null ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
