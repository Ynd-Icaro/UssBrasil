'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Trash2, Package, Palette, Save, Upload, 
  Image as ImageIcon, Ruler, Box, ChevronDown, ChevronUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { cn, formatPrice } from '@/lib/utils';

export interface ProductVariant {
  id?: string;
  name: string;
  sku?: string;
  barcode?: string;
  ncm?: string;
  options?: Record<string, string>;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  priceAdjustment?: number;
  stock: number;
  image?: string;
  images?: string[];
  color?: string;
  colorHex?: string;
  serialNumbers?: string[];
  // Dimensões
  weight?: number;       // peso em gramas
  width?: number;        // largura em cm
  height?: number;       // altura em cm
  depth?: number;        // profundidade em cm
  isActive: boolean;
}

export interface ProductColor {
  id?: string;
  name: string;
  hexCode?: string;
  images: string[];
  stock: number;
  priceModifier?: number;
  isDefault: boolean;
}

interface VariationAttribute {
  name: string;
  values: string[];
}

interface ProductVariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  basePrice: number;
  variants: ProductVariant[];
  colors: ProductColor[];
  onSave: (variants: ProductVariant[], colors: ProductColor[]) => void;
}

export default function ProductVariationsModal({
  isOpen,
  onClose,
  productName,
  basePrice,
  variants: initialVariants,
  colors: initialColors,
  onSave,
}: ProductVariationsModalProps) {
  const [activeTab, setActiveTab] = useState<'variants' | 'colors'>('variants');
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [colors, setColors] = useState<ProductColor[]>(initialColors);
  const [attributes, setAttributes] = useState<VariationAttribute[]>([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  const [expandedVariant, setExpandedVariant] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<{ type: 'variant' | 'color'; index: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVariants(initialVariants);
      setColors(initialColors);
      
      // Extrair atributos das variações existentes
      const attrs: Record<string, Set<string>> = {};
      initialVariants.forEach(v => {
        if (v.options) {
          Object.entries(v.options).forEach(([key, value]) => {
            if (!attrs[key]) attrs[key] = new Set();
            attrs[key].add(value);
          });
        }
      });
      setAttributes(Object.entries(attrs).map(([name, values]) => ({
        name,
        values: Array.from(values),
      })));
    }
  }, [isOpen, initialVariants, initialColors]);

  // ========== ATRIBUTOS ==========
  const addAttribute = () => {
    if (!newAttributeName.trim()) return;
    if (attributes.find(a => a.name.toLowerCase() === newAttributeName.toLowerCase())) return;
    
    setAttributes([...attributes, { name: newAttributeName, values: [] }]);
    setNewAttributeName('');
    setSelectedAttribute(newAttributeName);
  };

  const addAttributeValue = (attrName: string) => {
    if (!newAttributeValue.trim()) return;
    
    setAttributes(attrs => attrs.map(a => {
      if (a.name === attrName && !a.values.includes(newAttributeValue)) {
        return { ...a, values: [...a.values, newAttributeValue] };
      }
      return a;
    }));
    setNewAttributeValue('');
  };

  const removeAttribute = (attrName: string) => {
    setAttributes(attrs => attrs.filter(a => a.name !== attrName));
    if (selectedAttribute === attrName) setSelectedAttribute(null);
  };

  const removeAttributeValue = (attrName: string, value: string) => {
    setAttributes(attrs => attrs.map(a => {
      if (a.name === attrName) {
        return { ...a, values: a.values.filter(v => v !== value) };
      }
      return a;
    }));
  };

  // ========== VARIAÇÕES ==========
  const generateVariations = () => {
    if (attributes.length === 0 || attributes.every(a => a.values.length === 0)) return;

    const combinations: Record<string, string>[] = [];
    
    const generateCombinations = (index: number, current: Record<string, string>) => {
      if (index === attributes.length) {
        combinations.push({ ...current });
        return;
      }
      
      const attr = attributes[index];
      if (attr.values.length === 0) {
        generateCombinations(index + 1, current);
      } else {
        for (const value of attr.values) {
          current[attr.name] = value;
          generateCombinations(index + 1, current);
        }
      }
    };

    generateCombinations(0, {});

    const newVariants: ProductVariant[] = combinations.map((options) => {
      const optionStr = Object.values(options).join(' ');
      return {
        name: `${productName} ${optionStr}`,
        sku: '',
        options,
        price: basePrice,
        stock: 0,
        weight: 0,
        width: 0,
        height: 0,
        depth: 0,
        isActive: true,
      };
    });

    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, {
      name: `${productName} - Variação ${variants.length + 1}`,
      sku: '',
      options: {},
      price: basePrice,
      stock: 0,
      weight: 0,
      width: 0,
      height: 0,
      depth: 0,
      isActive: true,
    }]);
  };

  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    setVariants(v => v.map((variant, i) => 
      i === index ? { ...variant, ...updates } : variant
    ));
  };

  const removeVariant = (index: number) => {
    setVariants(v => v.filter((_, i) => i !== index));
  };

  // ========== CORES ==========
  const addColor = () => {
    setColors([...colors, {
      name: '',
      hexCode: '#000000',
      images: [],
      stock: 0,
      priceModifier: 0,
      isDefault: colors.length === 0,
    }]);
  };

  const updateColor = (index: number, updates: Partial<ProductColor>) => {
    setColors(c => c.map((color, i) => 
      i === index ? { ...color, ...updates } : color
    ));
  };

  const removeColor = (index: number) => {
    setColors(c => {
      const newColors = c.filter((_, i) => i !== index);
      if (newColors.length > 0 && !newColors.some(c => c.isDefault)) {
        newColors[0].isDefault = true;
      }
      return newColors;
    });
  };

  const setDefaultColor = (index: number) => {
    setColors(c => c.map((color, i) => ({ ...color, isDefault: i === index })));
  };

  // ========== UPLOAD DE IMAGEM ==========
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;

    // Simular upload - em produção, enviar para o servidor/cloudinary
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      
      if (uploadingFor.type === 'variant') {
        updateVariant(uploadingFor.index, { image: imageUrl });
      } else {
        const color = colors[uploadingFor.index];
        updateColor(uploadingFor.index, { 
          images: [...(color.images || []), imageUrl] 
        });
      }
      
      setUploadingFor(null);
    };
    reader.readAsDataURL(file);
    
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = (type: 'variant' | 'color', index: number) => {
    setUploadingFor({ type, index });
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    onSave(variants, colors);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Variações do Produto</h2>
              <p className="text-sm text-text-secondary mt-1">{productName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('variants')}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === 'variants'
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Package className="w-4 h-4 inline-block mr-2" />
              Variações ({variants.length})
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === 'colors'
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Palette className="w-4 h-4 inline-block mr-2" />
              Cores ({colors.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'variants' && (
              <div className="space-y-6">
                {/* Gerador de atributos */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="font-medium text-text-primary">Gerador de Variações</h3>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAttributeName}
                      onChange={(e) => setNewAttributeName(e.target.value)}
                      placeholder="Nome do atributo (ex: Tamanho, Cor, Armazenamento)"
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && addAttribute()}
                    />
                    <Button onClick={addAttribute} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Adicionar
                    </Button>
                  </div>

                  {/* Lista de atributos */}
                  <div className="space-y-3">
                    {attributes.map((attr) => (
                      <div key={attr.name} className="bg-white rounded-lg p-3 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{attr.name}</span>
                          <button 
                            onClick={() => removeAttribute(attr.name)}
                            className="text-error hover:bg-error/10 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {attr.values.map((value) => (
                            <span 
                              key={value}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                            >
                              {value}
                              <button 
                                onClick={() => removeAttributeValue(attr.name, value)}
                                className="hover:text-error"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={selectedAttribute === attr.name ? newAttributeValue : ''}
                            onChange={(e) => {
                              setSelectedAttribute(attr.name);
                              setNewAttributeValue(e.target.value);
                            }}
                            onFocus={() => setSelectedAttribute(attr.name)}
                            placeholder={`Adicionar valor`}
                            className="flex-1 px-2 py-1 border border-border rounded text-xs"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addAttributeValue(attr.name);
                              }
                            }}
                          />
                          <Button 
                            onClick={() => addAttributeValue(attr.name)} 
                            variant="ghost" 
                            size="sm"
                            className="h-7"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {attributes.some(a => a.values.length > 0) && (
                    <Button onClick={generateVariations} variant="outline" className="w-full">
                      <Package className="w-4 h-4 mr-2" />
                      Gerar {attributes.reduce((acc, a) => acc * (a.values.length || 1), 1)} Variações
                    </Button>
                  )}
                </div>

                {/* Lista de variações */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-text-primary">Variações ({variants.length})</h3>
                    <Button onClick={addVariant} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Manual
                    </Button>
                  </div>

                  {variants.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma variação criada</p>
                      <p className="text-sm">Use o gerador acima ou adicione manualmente</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {variants.map((variant, index) => (
                        <div 
                          key={index} 
                          className="bg-white border border-border rounded-lg overflow-hidden"
                        >
                          {/* Header da variação - sempre visível */}
                          <div 
                            className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => setExpandedVariant(expandedVariant === index ? null : index)}
                          >
                            {/* Imagem */}
                            <div 
                              className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerUpload('variant', index);
                              }}
                            >
                              {variant.image ? (
                                <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="w-6 h-6 text-gray-400 mx-auto" />
                                  <span className="text-[10px] text-gray-400">Clique</span>
                                </div>
                              )}
                            </div>

                            {/* Info básica */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{variant.name}</div>
                              <div className="text-xs text-text-secondary">
                                {variant.sku && <span>SKU: {variant.sku} • </span>}
                                <span>Estoque: {variant.stock}</span>
                                {variant.color && (
                                  <span className="ml-2 inline-flex items-center gap-1">
                                    <span 
                                      className="w-3 h-3 rounded-full border" 
                                      style={{ backgroundColor: variant.colorHex || '#ccc' }}
                                    />
                                    {variant.color}
                                  </span>
                                )}
                              </div>
                              {variant.options && Object.keys(variant.options).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Object.entries(variant.options).map(([key, value]) => (
                                    <span key={key} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Preço e ações */}
                            <div className="text-right flex-shrink-0">
                              <div className="font-semibold text-primary">
                                {formatPrice(variant.price || basePrice)}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <label className="flex items-center gap-1 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={variant.isActive}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      updateVariant(index, { isActive: e.target.checked });
                                    }}
                                    className="rounded w-3 h-3"
                                  />
                                  Ativo
                                </label>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeVariant(index);
                                }}
                                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {expandedVariant === index ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Detalhes expandidos */}
                          <AnimatePresence>
                            {expandedVariant === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-border overflow-hidden"
                              >
                                <div className="p-4 bg-gray-50 space-y-4">
                                  {/* Linha 1: Nome, SKU, Código de Barras */}
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">Nome</label>
                                      <input
                                        type="text"
                                        value={variant.name}
                                        onChange={(e) => updateVariant(index, { name: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">SKU</label>
                                      <input
                                        type="text"
                                        value={variant.sku || ''}
                                        onChange={(e) => updateVariant(index, { sku: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                        placeholder="SKU-001"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">Código de Barras</label>
                                      <input
                                        type="text"
                                        value={variant.barcode || ''}
                                        onChange={(e) => updateVariant(index, { barcode: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                        placeholder="EAN/UPC"
                                      />
                                    </div>
                                  </div>

                                  {/* Linha 2: Cor */}
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">Cor</label>
                                      <input
                                        type="text"
                                        value={variant.color || ''}
                                        onChange={(e) => updateVariant(index, { color: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                        placeholder="Nome da cor"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">Cor (Hex)</label>
                                      <div className="flex gap-2 mt-1">
                                        <input
                                          type="color"
                                          value={variant.colorHex || '#000000'}
                                          onChange={(e) => updateVariant(index, { colorHex: e.target.value })}
                                          className="w-10 h-10 rounded border border-border cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={variant.colorHex || ''}
                                          onChange={(e) => updateVariant(index, { colorHex: e.target.value })}
                                          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm uppercase"
                                          placeholder="#000000"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">NCM</label>
                                      <input
                                        type="text"
                                        value={variant.ncm || ''}
                                        onChange={(e) => updateVariant(index, { ncm: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                        placeholder="00000000"
                                      />
                                    </div>
                                  </div>

                                  {/* Linha 3: Preços e Estoque */}
                                  <div className="grid grid-cols-4 gap-3">
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">Preço (R$)</label>
                                      <input
                                        type="number"
                                        value={variant.price || ''}
                                        onChange={(e) => updateVariant(index, { price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                        step="0.01"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">Preço Comparativo</label>
                                      <input
                                        type="number"
                                        value={variant.comparePrice || ''}
                                        onChange={(e) => updateVariant(index, { comparePrice: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                        step="0.01"
                                        placeholder="De:"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">Custo</label>
                                      <input
                                        type="number"
                                        value={variant.costPrice || ''}
                                        onChange={(e) => updateVariant(index, { costPrice: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                        step="0.01"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-text-secondary font-medium">Estoque</label>
                                      <input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => updateVariant(index, { stock: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                        min="0"
                                      />
                                    </div>
                                  </div>

                                  {/* Linha 4: Dimensões */}
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Ruler className="w-4 h-4 text-text-secondary" />
                                      <label className="text-xs text-text-secondary font-medium">Dimensões</label>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                      <div>
                                        <label className="text-xs text-text-tertiary">Peso (g)</label>
                                        <input
                                          type="number"
                                          value={variant.weight || ''}
                                          onChange={(e) => updateVariant(index, { weight: Number(e.target.value) })}
                                          className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                          min="0"
                                          placeholder="0"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-text-tertiary">Largura (cm)</label>
                                        <input
                                          type="number"
                                          value={variant.width || ''}
                                          onChange={(e) => updateVariant(index, { width: Number(e.target.value) })}
                                          className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                          min="0"
                                          step="0.1"
                                          placeholder="0"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-text-tertiary">Altura (cm)</label>
                                        <input
                                          type="number"
                                          value={variant.height || ''}
                                          onChange={(e) => updateVariant(index, { height: Number(e.target.value) })}
                                          className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                          min="0"
                                          step="0.1"
                                          placeholder="0"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-text-tertiary">Profundidade (cm)</label>
                                        <input
                                          type="number"
                                          value={variant.depth || ''}
                                          onChange={(e) => updateVariant(index, { depth: Number(e.target.value) })}
                                          className="w-full px-3 py-2 border border-border rounded-lg text-sm mt-1"
                                          min="0"
                                          step="0.1"
                                          placeholder="0"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text-primary">Cores do Produto</h3>
                  <Button onClick={addColor} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Adicionar Cor
                  </Button>
                </div>

                {colors.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary">
                    <Palette className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma cor adicionada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {colors.map((color, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "bg-white border rounded-lg p-4",
                          color.isDefault ? "border-primary" : "border-border"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          {/* Preview da cor e imagens */}
                          <div className="flex flex-col gap-2">
                            <div 
                              className="w-16 h-16 rounded-lg border-2 border-border flex-shrink-0"
                              style={{ backgroundColor: color.hexCode || '#ccc' }}
                            />
                            {/* Galeria de imagens */}
                            <div className="flex gap-1 flex-wrap">
                              {color.images?.slice(0, 3).map((img, imgIdx) => (
                                <div 
                                  key={imgIdx} 
                                  className="w-8 h-8 rounded overflow-hidden relative group"
                                >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => {
                                      const newImages = color.images.filter((_, i) => i !== imgIdx);
                                      updateColor(index, { images: newImages });
                                    }}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                  >
                                    <X className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => triggerUpload('color', index)}
                                className="w-8 h-8 rounded border border-dashed border-gray-300 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                              >
                                <Plus className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="text-xs text-text-secondary">Nome da Cor</label>
                              <input
                                type="text"
                                value={color.name}
                                onChange={(e) => updateColor(index, { name: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                placeholder="Preto, Azul..."
                              />
                            </div>
                            <div>
                              <label className="text-xs text-text-secondary">Código Hex</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={color.hexCode || '#000000'}
                                  onChange={(e) => updateColor(index, { hexCode: e.target.value })}
                                  className="w-10 h-10 rounded border border-border cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={color.hexCode || ''}
                                  onChange={(e) => updateColor(index, { hexCode: e.target.value })}
                                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm uppercase"
                                  placeholder="#000000"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-text-secondary">Estoque</label>
                              <input
                                type="number"
                                value={color.stock}
                                onChange={(e) => updateColor(index, { stock: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-text-secondary">Ajuste Preço (R$)</label>
                              <input
                                type="number"
                                value={color.priceModifier || ''}
                                onChange={(e) => updateColor(index, { priceModifier: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                placeholder="0.00"
                                step="0.01"
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => setDefaultColor(index)}
                              className={cn(
                                "text-xs px-2 py-1 rounded transition-colors",
                                color.isDefault 
                                  ? "bg-primary text-white" 
                                  : "bg-gray-100 hover:bg-gray-200"
                              )}
                            >
                              {color.isDefault ? 'Padrão' : 'Definir'}
                            </button>
                            <button
                              onClick={() => removeColor(index)}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50">
            <div className="text-sm text-text-secondary">
              {variants.length} variações • {colors.length} cores
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Variações
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
