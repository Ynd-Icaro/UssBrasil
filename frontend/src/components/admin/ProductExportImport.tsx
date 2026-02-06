'use client';

import { useState, useRef } from 'react';
import { 
  Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle2, 
  X, Info, Copy, FileDown, FileUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ProductExportData {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  ncm?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  priceInDollar?: number;
  stock: number;
  minStock?: number;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  category?: string;
  brand?: string;
  tags?: string;
  isActive: boolean;
  isFeatured?: boolean;
  variants?: string; // JSON stringified
  colors?: string;   // JSON stringified
}

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string }>;
  warnings: Array<{ row: number; warning: string }>;
}

interface ProductExportImportProps {
  products?: any[];
  onImport?: (products: ProductExportData[]) => Promise<ImportResult>;
  onClose?: () => void;
}

// Modelo padrão para importação
const TEMPLATE_HEADERS = [
  'name',
  'slug',
  'description',
  'shortDescription',
  'sku',
  'barcode',
  'ncm',
  'price',
  'comparePrice',
  'costPrice',
  'priceInDollar',
  'stock',
  'minStock',
  'weight',
  'width',
  'height',
  'depth',
  'category',
  'brand',
  'tags',
  'isActive',
  'isFeatured',
  'variants',
  'colors'
];

const TEMPLATE_EXAMPLE: ProductExportData = {
  name: 'iPhone 15 Pro Max 256GB',
  slug: 'iphone-15-pro-max-256gb',
  description: 'O iPhone mais avançado da Apple com chip A17 Pro',
  shortDescription: 'iPhone 15 Pro Max com 256GB',
  sku: 'IPHONE-15PM-256',
  barcode: '0194253401230',
  ncm: '85171231',
  price: 9999.00,
  comparePrice: 11999.00,
  costPrice: 7500.00,
  priceInDollar: 1199.00,
  stock: 50,
  minStock: 5,
  weight: 221,
  width: 7.69,
  height: 15.99,
  depth: 0.83,
  category: 'Smartphones',
  brand: 'Apple',
  tags: 'iphone,apple,smartphone,5g',
  isActive: true,
  isFeatured: true,
  variants: JSON.stringify([
    { name: '256GB', sku: 'IPH15PM-256', stock: 20, price: 9999 },
    { name: '512GB', sku: 'IPH15PM-512', stock: 15, price: 11499 },
    { name: '1TB', sku: 'IPH15PM-1TB', stock: 10, price: 13499 }
  ]),
  colors: JSON.stringify([
    { name: 'Titânio Natural', hexCode: '#A7A7AA', stock: 15 },
    { name: 'Titânio Azul', hexCode: '#3C4043', stock: 10 },
    { name: 'Titânio Preto', hexCode: '#1D1D1F', stock: 20 }
  ])
};

export default function ProductExportImport({ 
  products = [], 
  onImport,
  onClose 
}: ProductExportImportProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'template'>('template');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [importData, setImportData] = useState<ProductExportData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exportar produtos para CSV
  const exportToCSV = (data: any[], filename: string) => {
    const headers = TEMPLATE_HEADERS;
    const csvContent = [
      headers.join(';'),
      ...data.map(item => 
        headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
          if (typeof value === 'string' && (value.includes(';') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        }).join(';')
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Download do template
  const downloadTemplate = () => {
    exportToCSV([TEMPLATE_EXAMPLE], 'template_produtos_ussbrasil.csv');
  };

  // Exportar produtos selecionados
  const exportSelectedProducts = () => {
    const toExport = selectedProducts.length > 0 
      ? products.filter(p => selectedProducts.includes(p.id))
      : products;
    
    const exportData = toExport.map(p => ({
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      sku: p.sku || '',
      barcode: p.barcode || '',
      ncm: p.ncm || '',
      price: p.price,
      comparePrice: p.comparePrice || '',
      costPrice: p.costPrice || '',
      priceInDollar: p.priceInDollar || '',
      stock: p.stock,
      minStock: p.minStock || '',
      weight: p.weight || '',
      width: p.width || '',
      height: p.height || '',
      depth: p.depth || '',
      category: p.category?.name || '',
      brand: p.brand?.name || '',
      tags: p.tags?.join(',') || '',
      isActive: p.isActive,
      isFeatured: p.isFeatured || false,
      variants: p.variants ? JSON.stringify(p.variants) : '',
      colors: p.colors ? JSON.stringify(p.colors) : '',
    }));

    const date = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `produtos_ussbrasil_${date}.csv`);
  };

  // Processar arquivo importado
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('Arquivo vazio ou inválido');
        return;
      }

      // Detectar separador (vírgula ou ponto-e-vírgula)
      const separator = lines[0].includes(';') ? ';' : ',';
      const headers = lines[0].split(separator).map(h => h.trim().replace(/"/g, ''));
      
      const data: ProductExportData[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i], separator);
        if (values.length === 0) continue;

        const item: any = {};
        headers.forEach((header, idx) => {
          let value = values[idx]?.trim().replace(/^"|"$/g, '') || '';
          
          // Converter tipos
          if (['price', 'comparePrice', 'costPrice', 'priceInDollar', 'weight', 'width', 'height', 'depth'].includes(header)) {
            item[header] = value ? parseFloat(value.replace(',', '.')) : undefined;
          } else if (['stock', 'minStock'].includes(header)) {
            item[header] = value ? parseInt(value) : 0;
          } else if (['isActive', 'isFeatured'].includes(header)) {
            item[header] = value.toLowerCase() === 'true' || value === '1';
          } else {
            item[header] = value;
          }
        });

        data.push(item as ProductExportData);
      }

      setImportData(data);
      setActiveTab('import');
    };
    reader.readAsText(file, 'UTF-8');

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Parser de linha CSV que lida com aspas
  const parseCSVLine = (line: string, separator: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === separator && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    
    return result;
  };

  // Executar importação
  const handleImport = async () => {
    if (!onImport || importData.length === 0) return;

    setImporting(true);
    try {
      const result = await onImport(importData);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: 0,
        errors: [{ row: 0, error: 'Erro ao importar: ' + (error as Error).message }],
        warnings: []
      });
    } finally {
      setImporting(false);
    }
  };

  // Copiar template para clipboard
  const copyTemplateToClipboard = () => {
    const headers = TEMPLATE_HEADERS.join('\t');
    const example = TEMPLATE_HEADERS.map(h => {
      const value = (TEMPLATE_EXAMPLE as any)[h];
      if (value === undefined || value === null) return '';
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }).join('\t');

    navigator.clipboard.writeText(`${headers}\n${example}`);
    alert('Template copiado para a área de transferência!');
  };

  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Exportar / Importar Produtos</h2>
            <p className="text-sm text-text-secondary">Gerencie seus produtos em massa</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('template')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === 'template'
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Info className="w-4 h-4 inline-block mr-2" />
          Modelo Padrão
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === 'export'
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <FileDown className="w-4 h-4 inline-block mr-2" />
          Exportar ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === 'import'
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <FileUp className="w-4 h-4 inline-block mr-2" />
          Importar {importData.length > 0 && `(${importData.length})`}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        {/* Modelo Padrão */}
        {activeTab === 'template' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Como usar:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Baixe o modelo padrão CSV abaixo</li>
                    <li>Abra no Excel ou Google Sheets</li>
                    <li>Preencha os dados dos produtos seguindo o exemplo</li>
                    <li>Salve como CSV (separado por ponto-e-vírgula)</li>
                    <li>Importe o arquivo na aba "Importar"</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">Colunas do Modelo</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Campo</th>
                      <th className="px-3 py-2 text-left font-medium">Obrigatório</th>
                      <th className="px-3 py-2 text-left font-medium">Descrição</th>
                      <th className="px-3 py-2 text-left font-medium">Exemplo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">name</td>
                      <td className="px-3 py-2"><span className="text-green-600 font-medium">Sim</span></td>
                      <td className="px-3 py-2">Nome do produto</td>
                      <td className="px-3 py-2 text-text-secondary">iPhone 15 Pro Max</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">slug</td>
                      <td className="px-3 py-2"><span className="text-green-600 font-medium">Sim</span></td>
                      <td className="px-3 py-2">URL amigável (único)</td>
                      <td className="px-3 py-2 text-text-secondary">iphone-15-pro-max</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">price</td>
                      <td className="px-3 py-2"><span className="text-green-600 font-medium">Sim</span></td>
                      <td className="px-3 py-2">Preço de venda (R$)</td>
                      <td className="px-3 py-2 text-text-secondary">9999.00</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">stock</td>
                      <td className="px-3 py-2"><span className="text-green-600 font-medium">Sim</span></td>
                      <td className="px-3 py-2">Quantidade em estoque</td>
                      <td className="px-3 py-2 text-text-secondary">50</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">isActive</td>
                      <td className="px-3 py-2"><span className="text-green-600 font-medium">Sim</span></td>
                      <td className="px-3 py-2">Produto ativo (true/false)</td>
                      <td className="px-3 py-2 text-text-secondary">true</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">description</td>
                      <td className="px-3 py-2"><span className="text-text-tertiary">Não</span></td>
                      <td className="px-3 py-2">Descrição completa</td>
                      <td className="px-3 py-2 text-text-secondary">O iPhone mais avançado...</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">sku</td>
                      <td className="px-3 py-2"><span className="text-text-tertiary">Não</span></td>
                      <td className="px-3 py-2">Código SKU interno</td>
                      <td className="px-3 py-2 text-text-secondary">IPHONE-15PM-256</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">priceInDollar</td>
                      <td className="px-3 py-2"><span className="text-text-tertiary">Não</span></td>
                      <td className="px-3 py-2">Preço em USD (importados)</td>
                      <td className="px-3 py-2 text-text-secondary">1199.00</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">costPrice</td>
                      <td className="px-3 py-2"><span className="text-text-tertiary">Não</span></td>
                      <td className="px-3 py-2">Preço de custo (R$)</td>
                      <td className="px-3 py-2 text-text-secondary">7500.00</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">weight, width, height, depth</td>
                      <td className="px-3 py-2"><span className="text-text-tertiary">Não</span></td>
                      <td className="px-3 py-2">Dimensões (g, cm)</td>
                      <td className="px-3 py-2 text-text-secondary">221, 7.69, 15.99, 0.83</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">variants</td>
                      <td className="px-3 py-2"><span className="text-text-tertiary">Não</span></td>
                      <td className="px-3 py-2">Variações (JSON)</td>
                      <td className="px-3 py-2 text-text-secondary text-xs">[{`{name, sku, stock, price}`}]</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs">colors</td>
                      <td className="px-3 py-2"><span className="text-text-tertiary">Não</span></td>
                      <td className="px-3 py-2">Cores (JSON)</td>
                      <td className="px-3 py-2 text-text-secondary text-xs">[{`{name, hexCode, stock}`}]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={downloadTemplate} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Baixar Modelo CSV
              </Button>
              <Button onClick={copyTemplateToClipboard} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copiar para Clipboard
              </Button>
            </div>
          </div>
        )}

        {/* Exportar */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            {products.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum produto para exportar</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Selecionar produtos</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedProducts(products.map(p => p.id))}
                        className="text-sm text-primary hover:underline"
                      >
                        Selecionar todos
                      </button>
                      <span className="text-text-tertiary">|</span>
                      <button
                        onClick={() => setSelectedProducts([])}
                        className="text-sm text-primary hover:underline"
                      >
                        Limpar seleção
                      </button>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {products.map(product => (
                      <label 
                        key={product.id}
                        className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{product.name}</span>
                        <span className="text-xs text-text-tertiary ml-auto">{product.sku || '-'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-text-secondary mb-4">
                    {selectedProducts.length > 0 
                      ? `${selectedProducts.length} produto(s) selecionado(s)`
                      : `Todos os ${products.length} produtos serão exportados`
                    }
                  </p>
                  <Button onClick={exportSelectedProducts} size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar para CSV
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Importar */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            {importData.length === 0 ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-text-primary mb-2">
                  Arraste um arquivo CSV ou clique para selecionar
                </p>
                <p className="text-sm text-text-secondary">
                  Use o modelo padrão para garantir a compatibilidade
                </p>
              </div>
            ) : (
              <>
                {/* Preview dos dados */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">{importData.length} produto(s) carregado(s)</span>
                    <button
                      onClick={() => setImportData([])}
                      className="text-sm text-error hover:underline"
                    >
                      Limpar
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">#</th>
                          <th className="px-2 py-1 text-left">Nome</th>
                          <th className="px-2 py-1 text-left">SKU</th>
                          <th className="px-2 py-1 text-right">Preço</th>
                          <th className="px-2 py-1 text-right">Estoque</th>
                          <th className="px-2 py-1 text-center">Ativo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {importData.slice(0, 10).map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-2 py-1 text-text-tertiary">{idx + 1}</td>
                            <td className="px-2 py-1 max-w-[200px] truncate">{item.name}</td>
                            <td className="px-2 py-1">{item.sku || '-'}</td>
                            <td className="px-2 py-1 text-right">R$ {item.price?.toFixed(2) || '0.00'}</td>
                            <td className="px-2 py-1 text-right">{item.stock || 0}</td>
                            <td className="px-2 py-1 text-center">
                              {item.isActive ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-4 h-4 text-gray-400 mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importData.length > 10 && (
                      <div className="text-center text-xs text-text-tertiary py-2">
                        ... e mais {importData.length - 10} produtos
                      </div>
                    )}
                  </div>
                </div>

                {/* Resultado da importação */}
                {importResult && (
                  <div className="space-y-3">
                    <div className={cn(
                      "p-4 rounded-lg flex items-center gap-3",
                      importResult.success > 0 && importResult.errors.length === 0
                        ? "bg-green-50 border border-green-200"
                        : importResult.errors.length > 0
                        ? "bg-red-50 border border-red-200"
                        : "bg-yellow-50 border border-yellow-200"
                    )}>
                      {importResult.errors.length === 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          {importResult.success} produto(s) importado(s) com sucesso
                        </p>
                        {importResult.errors.length > 0 && (
                          <p className="text-sm text-red-600">
                            {importResult.errors.length} erro(s) encontrado(s)
                          </p>
                        )}
                      </div>
                    </div>

                    {importResult.errors.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-4 text-sm">
                        <p className="font-medium text-red-800 mb-2">Erros:</p>
                        <ul className="space-y-1 text-red-700">
                          {importResult.errors.map((err, idx) => (
                            <li key={idx}>Linha {err.row}: {err.error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Carregar Outro Arquivo
                  </Button>
                  <Button 
                    onClick={handleImport}
                    disabled={importing}
                    className="flex-1"
                  >
                    {importing ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                        />
                        Importando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Importar {importData.length} Produto(s)
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
