'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Lock, CheckCircle, Eye, EyeOff, XCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import api from '@/lib/api';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  // Verificações de senha em tempo real
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  // Verifica se o token está presente
  useEffect(() => {
    if (!token) {
      setError('Token de recuperação inválido ou ausente');
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Token de recuperação inválido');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-border p-8 shadow-card text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Link inválido</h2>
            <p className="text-text-secondary mb-6">
              O link de recuperação de senha é inválido ou expirou. Solicite um novo link.
            </p>
            <Link href="/forgot-password">
              <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                Solicitar novo link
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-border p-8 shadow-card text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Senha alterada!</h2>
            <p className="text-text-secondary mb-6">
              Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.
            </p>
            <Link href="/login">
              <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                Ir para o login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              USS<span className="text-primary">BRASIL</span>
            </h1>
          </Link>
          <p className="text-text-secondary mt-2">
            Redefinir senha
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-border p-8 shadow-card">
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-text mb-2">
              Crie uma nova senha
            </h2>
            <p className="text-text-secondary text-sm">
              Sua nova senha deve ser diferente das senhas anteriores.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Input
                label="Nova senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua nova senha"
                {...register('password')}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password strength indicators */}
            {password && (
              <div className="space-y-2 p-3 bg-surface rounded-lg">
                <p className="text-xs font-medium text-text-secondary mb-2">Requisitos da senha:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-2 text-xs ${hasMinLength ? 'text-success' : 'text-text-secondary'}`}>
                    <CheckCircle className={`w-3 h-3 ${hasMinLength ? '' : 'opacity-30'}`} />
                    8+ caracteres
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${hasUpperCase ? 'text-success' : 'text-text-secondary'}`}>
                    <CheckCircle className={`w-3 h-3 ${hasUpperCase ? '' : 'opacity-30'}`} />
                    Letra maiúscula
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${hasLowerCase ? 'text-success' : 'text-text-secondary'}`}>
                    <CheckCircle className={`w-3 h-3 ${hasLowerCase ? '' : 'opacity-30'}`} />
                    Letra minúscula
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${hasNumber ? 'text-success' : 'text-text-secondary'}`}>
                    <CheckCircle className={`w-3 h-3 ${hasNumber ? '' : 'opacity-30'}`} />
                    Número
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                label="Confirmar senha"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua nova senha"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-primary transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error text-error text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                'Redefinir senha'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
