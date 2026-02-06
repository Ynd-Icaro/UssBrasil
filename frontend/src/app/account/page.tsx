'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Check } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store';
import api from '@/lib/api';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.patch('/users/profile', data);
      updateUser(response.data.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Minha Conta</h1>
        <p className="text-text-secondary">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold mb-6">Informações Pessoais</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome"
              type="text"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Sobrenome"
              type="text"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="E-mail"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            {...register('phone')}
          />

          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error text-error text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success text-success text-sm">
              <Check className="w-4 h-4" />
              Perfil atualizado com sucesso!
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar alterações'
            )}
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold mb-6">Alterar Senha</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

  type PasswordFormData = z.infer<typeof passwordSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.patch('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <Input
        label="Senha atual"
        type="password"
        {...register('currentPassword')}
        error={errors.currentPassword?.message}
      />

      <Input
        label="Nova senha"
        type="password"
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />

      <Input
        label="Confirmar nova senha"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error text-error text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success text-success text-sm">
          <Check className="w-4 h-4" />
          Senha alterada com sucesso!
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Alterando...
          </>
        ) : (
          'Alterar senha'
        )}
      </Button>
    </form>
  );
}
