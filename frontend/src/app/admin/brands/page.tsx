'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Building2 } from 'lucide-react';
import { Button, Input, Badge, Skeleton, Modal } from '@/components/ui';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  _count?: {
    products: number;
  };
  createdAt: string;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    setIsLoading(true);
    try {
      const response = await api.get('/brands?includeInactive=true');
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || '',
        logo: brand.logo || '',
        website: brand.website || '',
        isActive: brand.isActive,
      });
    } else {
      setEditingBrand(null);
      setFormData({
        name: '',
        description: '',
        logo: '',
        website: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingBrand) {
        await api.patch(`/brands/${editingBrand.id}`, formData);
      } else {
        await api.post('/brands', formData);
      }
      await loadBrands();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving brand:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta marca?')) return;

    try {
      await api.delete(`/brands/${id}`);
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const toggleStatus = async (brand: Brand) => {
    try {
      await api.patch(`/brands/${brand.id}`, { isActive: !brand.isActive });
      await loadBrands();
    } catch (error) {
      console.error('Error toggling brand status:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Marcas</h1>
          <p className="text-text-secondary">
            Gerencie as marcas de produtos
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" />
          Nova Marca
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            type="text"
            placeholder="Buscar marcas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-6">
              <Skeleton className="h-16 w-16 rounded-lg mx-auto mb-4" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto mb-4" />
              <Skeleton className="h-6 w-20 mx-auto" />
            </div>
          ))
        ) : filteredBrands.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-secondary">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma marca encontrada</p>
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow text-center"
            >
              <div className={cn(
                "w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center",
                brand.isActive ? "bg-primary/10" : "bg-gray-100"
              )}>
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <Building2 className={cn(
                    "w-8 h-8",
                    brand.isActive ? "text-primary" : "text-gray-400"
                  )} />
                )}
              </div>

              <h3 className="font-semibold mb-1">{brand.name}</h3>
              
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  {brand.website.replace(/^https?:\/\//, '').split('/')[0]}
                </a>
              )}

              <div className="flex justify-center mt-3 mb-4">
                <Badge variant={brand.isActive ? 'success' : 'secondary'}>
                  {brand.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>

              <p className="text-sm text-text-secondary mb-4">
                {brand._count?.products || 0} produtos
              </p>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => openModal(brand)}
                  className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBrand ? 'Editar Marca' : 'Nova Marca'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da marca"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da marca"
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL do Logo</label>
            <Input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
              placeholder="https://www.marca.com.br"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm">Marca ativa</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
