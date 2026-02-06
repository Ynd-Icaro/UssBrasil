'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, MapPin, Loader2, Check } from 'lucide-react';
import { Button, Input, Modal } from '@/components/ui';
import api from '@/lib/api';
import { Address } from '@/types';
import { cn } from '@/lib/utils';

const addressSchema = z.object({
  street: z.string().min(3, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  zipCode: z.string().min(8, 'CEP inválido'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const response = await api.get('/users/addresses');
      setAddresses(response.data.data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      reset({
        street: address.street,
        number: address.number,
        complement: address.complement || '',
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      reset({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    reset();
  };

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await api.patch(`/users/addresses/${editingAddress.id}`, data);
      } else {
        await api.post('/users/addresses', data);
      }
      await loadAddresses();
      closeModal();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) return;
    
    try {
      await api.delete(`/users/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/users/addresses/${id}`, { isDefault: true });
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Meus Endereços</h1>
          <p className="text-text-secondary">
            Gerencie seus endereços de entrega
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-surface rounded-xl animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <MapPin className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Nenhum endereço cadastrado
          </h2>
          <p className="text-text-secondary mb-6">
            Adicione um endereço para facilitar suas compras.
          </p>
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4" />
            Adicionar endereço
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                'bg-surface rounded-xl border p-6 relative',
                address.isDefault ? 'border-primary' : 'border-border'
              )}
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Padrão
                </span>
              )}
              <p className="font-medium mb-1">
                {address.street}, {address.number}
              </p>
              {address.complement && (
                <p className="text-text-secondary text-sm">
                  {address.complement}
                </p>
              )}
              <p className="text-text-secondary text-sm">
                {address.neighborhood}
              </p>
              <p className="text-text-secondary text-sm">
                {address.city} - {address.state}
              </p>
              <p className="text-text-secondary text-sm">
                CEP: {address.zipCode}
              </p>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => openModal(address)}
                  className="text-sm text-primary hover:underline"
                >
                  Editar
                </button>
                {!address.isDefault && (
                  <>
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm text-text-secondary hover:text-text-primary"
                    >
                      Definir como padrão
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-sm text-error hover:underline ml-auto"
                    >
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="CEP"
            placeholder="00000-000"
            {...register('zipCode')}
            error={errors.zipCode?.message}
          />
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Rua/Avenida"
                placeholder="Nome da rua"
                {...register('street')}
                error={errors.street?.message}
              />
            </div>
            <Input
              label="Número"
              placeholder="123"
              {...register('number')}
              error={errors.number?.message}
            />
          </div>
          <Input
            label="Complemento"
            placeholder="Apto, bloco, etc."
            {...register('complement')}
          />
          <Input
            label="Bairro"
            placeholder="Nome do bairro"
            {...register('neighborhood')}
            error={errors.neighborhood?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cidade"
              placeholder="Cidade"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="Estado"
              placeholder="UF"
              {...register('state')}
              error={errors.state?.message}
            />
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('isDefault')}
              className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary"
            />
            <span className="text-sm">Definir como endereço padrão</span>
          </label>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
