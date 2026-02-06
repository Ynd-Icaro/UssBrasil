'use client';

import { useState } from 'react';
import { Plus, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input, Modal } from '@/components/ui';
import api from '@/lib/api';

interface QuickAddBrandProps {
  onSuccess?: () => void;
  triggerClassName?: string;
  variant?: 'button' | 'card' | 'icon';
}

export function QuickAddBrand({ 
  onSuccess, 
  triggerClassName,
  variant = 'button' 
}: QuickAddBrandProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.post('/brands', formData);
      setFormData({ name: '', description: '', logo: '', website: '', isActive: true });
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating brand:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTrigger = () => {
    switch (variant) {
      case 'card':
        return (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(true)}
            className={`p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors text-center w-full ${triggerClassName}`}
          >
            <Plus className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="font-medium text-text-secondary">Nova Marca</p>
          </motion.button>
        );
      case 'icon':
        return (
          <button
            onClick={() => setIsOpen(true)}
            className={`p-2 rounded-lg hover:bg-primary/10 transition-colors ${triggerClassName}`}
            title="Adicionar Marca"
          >
            <Plus className="w-5 h-5 text-primary" />
          </button>
        );
      default:
        return (
          <Button onClick={() => setIsOpen(true)} className={`gap-2 ${triggerClassName}`}>
            <Plus className="w-4 h-4" />
            Nova Marca
          </Button>
        );
    }
  };

  return (
    <>
      {renderTrigger()}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Criar Nova Marca"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Marca"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Apple, Samsung, WavePro..."
            required
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              rows={3}
              placeholder="Descrição opcional da marca..."
            />
          </div>

          <Input
            label="URL do Logo"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            placeholder="https://..."
          />

          <Input
            label="Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://marca.com.br"
          />

          {formData.logo && (
            <div className="relative w-20 h-20 bg-surface rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={formData.logo}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Marca ativa (visível na loja)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Criando...' : 'Criar Marca'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
