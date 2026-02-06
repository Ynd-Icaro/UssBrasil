'use client';

import { useState } from 'react';
import { Plus, X, Folder, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Modal } from '@/components/ui';
import api from '@/lib/api';

interface QuickAddCategoryProps {
  onSuccess?: () => void;
  triggerClassName?: string;
  variant?: 'button' | 'card' | 'icon';
}

export function QuickAddCategory({ 
  onSuccess, 
  triggerClassName,
  variant = 'button' 
}: QuickAddCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.post('/categories', formData);
      setFormData({ name: '', description: '', image: '', isActive: true });
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating category:', error);
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
            <p className="font-medium text-text-secondary">Nova Categoria</p>
          </motion.button>
        );
      case 'icon':
        return (
          <button
            onClick={() => setIsOpen(true)}
            className={`p-2 rounded-lg hover:bg-primary/10 transition-colors ${triggerClassName}`}
            title="Adicionar Categoria"
          >
            <Plus className="w-5 h-5 text-primary" />
          </button>
        );
      default:
        return (
          <Button onClick={() => setIsOpen(true)} className={`gap-2 ${triggerClassName}`}>
            <Plus className="w-4 h-4" />
            Nova Categoria
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
        title="Criar Nova Categoria"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Categoria"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Smartphones, Acessórios..."
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
              placeholder="Descrição opcional da categoria..."
            />
          </div>

          <Input
            label="URL da Imagem"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />

          {formData.image && (
            <div className="relative w-20 h-20 bg-surface rounded-lg overflow-hidden">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
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
            <span className="text-sm">Categoria ativa (visível na loja)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
