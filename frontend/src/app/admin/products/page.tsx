'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Plus, Pencil, Trash2, Search, Filter, X,
  Package, DollarSign, TrendingUp, ShoppingCart,
  ChevronLeft, ChevronRight, BarChart3, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Badge, Skeleton } from '@/components/ui';
import ProductModal from '@/components/admin/ProductModal';
import api from '@/lib/api';
import { Product, Category, Brand } from '@/types';
import { formatPrice, cn } from '@/lib/utils';

// Simple Chart Component
function SimpleBarChart({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h3 className="font-medium text-text-primary mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, trend, color }: { 
  title: string; 
  value: string | number; 
  icon: any; 
  trend?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-border p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> {trend}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminProductsPage() {
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: '',
    brandId: '',
    status: '',
    stockStatus: '',
    priceMin: '',
    priceMax: '',
  });
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [currentPage, search, filters]);

  async function loadInitialData() {
    try {
      const [categoriesRes, brandsRes, ordersRes] = await Promise.all([
        api.get('/categories'),
        api.get('/brands'),
        api.get('/orders?limit=5').catch(() => ({ data: { data: [] } })),
      ]);
      setCategories(categoriesRes.data.data || []);
      setBrands(brandsRes.data.data || []);
      setRecentOrders(ordersRes.data?.data?.data || ordersRes.data?.data || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  async function loadProducts() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(currentPage));
      params.append('limit', '10');
      if (search) params.append('search', search);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.brandId) params.append('brandId', filters.brandId);
      if (filters.status === 'active') params.append('isActive', 'true');
      if (filters.status === 'inactive') params.append('isActive', 'false');

      const response = await api.get(`/products?${params.toString()}`);
      const data = response.data.data;
      
      let productsList = data.data || data || [];
      
      // Apply client-side filters
      if (filters.stockStatus === 'inStock') {
        productsList = productsList.filter((p: Product) => p.stock > 0);
      } else if (filters.stockStatus === 'outOfStock') {
        productsList = productsList.filter((p: Product) => p.stock === 0);
      } else if (filters.stockStatus === 'lowStock') {
        productsList = productsList.filter((p: Product) => p.stock > 0 && p.stock <= (p.lowStockAlert || 5));
      }
      
      if (filters.priceMin) {
        productsList = productsList.filter((p: Product) => Number(p.price) >= Number(filters.priceMin));
      }
      if (filters.priceMax) {
        productsList = productsList.filter((p: Product) => Number(p.price) <= Number(filters.priceMax));
      }
      
      setProducts(productsList);
      setTotalPages(data.meta?.totalPages || 1);
      setTotalProducts(data.meta?.total || productsList.length);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotalProducts(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erro ao excluir produto');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadProducts();
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const clearFilters = () => {
    setFilters({
      categoryId: '',
      brandId: '',
      status: '',
      stockStatus: '',
      priceMin: '',
      priceMax: '',
    });
    setSearch('');
    setCurrentPage(1);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Calculate statistics
  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * (p.stock || 0)), 0);
    const inStock = products.filter(p => p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockAlert || 5)).length;
    
    return { totalValue, inStock, outOfStock, lowStock };
  }, [products]);

  // Category distribution for chart
  const categoryDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    products.forEach(p => {
      const catName = p.category?.name || 'Sem categoria';
      distribution[catName] = (distribution[catName] || 0) + 1;
    });
    
    const colors = ['#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845', '#1B4F72', '#148F77', '#1E8449'];
    return Object.entries(distribution)
      .slice(0, 5)
      .map(([label, value], index) => ({
        label,
        value,
        color: colors[index % colors.length],
      }));
  }, [products]);

  // Price range distribution
  const priceDistribution = useMemo(() => {
    const ranges = [
      { label: 'Até R$ 100', min: 0, max: 100, color: '#10B981' },
      { label: 'R$ 100 - R$ 500', min: 100, max: 500, color: '#3B82F6' },
      { label: 'R$ 500 - R$ 1000', min: 500, max: 1000, color: '#8B5CF6' },
      { label: 'R$ 1000 - R$ 5000', min: 1000, max: 5000, color: '#F59E0B' },
      { label: 'Acima de R$ 5000', min: 5000, max: Infinity, color: '#EF4444' },
    ];
    
    return ranges.map(range => ({
      ...range,
      value: products.filter(p => {
        const price = Number(p.price);
        return price >= range.min && price < range.max;
      }).length,
    }));
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Produtos</h1>
          <p className="text-text-secondary">
            {totalProducts} produtos cadastrados
          </p>
        </div>
        <Button onClick={handleNewProduct} className="bg-primary hover:bg-primary-hover text-white">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Produtos"
          value={totalProducts}
          icon={Package}
          color="bg-primary"
        />
        <StatsCard
          title="Valor em Estoque"
          value={formatPrice(stats.totalValue)}
          icon={DollarSign}
          color="bg-success"
        />
        <StatsCard
          title="Em Estoque"
          value={stats.inStock}
          icon={TrendingUp}
          trend={`${stats.lowStock} com estoque baixo`}
          color="bg-info"
        />
        <StatsCard
          title="Sem Estoque"
          value={stats.outOfStock}
          icon={ShoppingCart}
          color="bg-error"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SimpleBarChart data={categoryDistribution} title="Produtos por Categoria" />
        <SimpleBarChart data={priceDistribution} title="Distribuição por Faixa de Preço" />
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="font-medium text-text-primary mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Últimas Compras
          </h3>
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">Pedido #{order.orderNumber || order.id?.slice(0, 8)}</p>
                  <p className="text-sm text-text-secondary">
                    {order.user?.firstName} {order.user?.lastName} • {order.items?.length || 0} itens
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{formatPrice(order.total || 0)}</p>
                  <Badge variant={
                    order.status === 'DELIVERED' ? 'success' :
                    order.status === 'CANCELLED' ? 'error' :
                    order.status === 'PENDING' ? 'warning' : 'secondary'
                  }>
                    {order.status || 'Pendente'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(activeFiltersCount > 0 && "border-primary text-primary")}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="text-text-secondary">
              <X className="w-4 h-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 mt-4 border-t border-border">
                {/* Category */}
                <div>
                  <label className="text-sm text-text-secondary block mb-1">Categoria</label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-white"
                  >
                    <option value="">Todas</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm text-text-secondary block mb-1">Marca</label>
                  <select
                    value={filters.brandId}
                    onChange={(e) => setFilters({ ...filters, brandId: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-white"
                  >
                    <option value="">Todas</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm text-text-secondary block mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-white"
                  >
                    <option value="">Todos</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>

                {/* Stock Status */}
                <div>
                  <label className="text-sm text-text-secondary block mb-1">Estoque</label>
                  <select
                    value={filters.stockStatus}
                    onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-white"
                  >
                    <option value="">Todos</option>
                    <option value="inStock">Em Estoque</option>
                    <option value="lowStock">Estoque Baixo</option>
                    <option value="outOfStock">Sem Estoque</option>
                  </select>
                </div>

                {/* Price Min */}
                <div>
                  <label className="text-sm text-text-secondary block mb-1">Preço Mín.</label>
                  <Input
                    type="number"
                    placeholder="R$ 0"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  />
                </div>

                {/* Price Max */}
                <div>
                  <label className="text-sm text-text-secondary block mb-1">Preço Máx.</label>
                  <Input
                    type="number"
                    placeholder="R$ 99999"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left p-4 font-medium text-text-secondary">Produto</th>
              <th className="text-left p-4 font-medium text-text-secondary">SKU</th>
              <th className="text-left p-4 font-medium text-text-secondary">Categoria</th>
              <th className="text-left p-4 font-medium text-text-secondary">Preço</th>
              <th className="text-left p-4 font-medium text-text-secondary">Estoque</th>
              <th className="text-left p-4 font-medium text-text-secondary">Status</th>
              <th className="text-right p-4 font-medium text-text-secondary">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </td>
                  <td className="p-4"><Skeleton className="h-5 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                  <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-secondary">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum produto encontrado</p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-text-secondary" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-text-secondary truncate">
                          {product.brand?.name || '-'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-text-secondary font-mono text-sm">
                      {product.sku || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-text-secondary">
                      {product.category?.name || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{formatPrice(product.price)}</p>
                    {product.comparePrice && (
                      <p className="text-sm text-text-secondary line-through">
                        {formatPrice(product.comparePrice)}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "font-medium",
                        product.stock > 10
                          ? 'text-success'
                          : product.stock > 0
                          ? 'text-warning'
                          : 'text-error'
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={product.isActive ? 'success' : 'secondary'}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
