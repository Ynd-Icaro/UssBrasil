'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  AlertCircle, 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  WifiOff,
  ServerOff,
  FileQuestion,
  ShieldX,
  Search
} from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  code?: number | string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

export function ErrorPage({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  code,
  onRetry,
  showHomeButton = true,
  showBackButton = true,
}: ErrorPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        {code && (
          <p className="text-6xl font-bold text-text/10 mb-2">{code}</p>
        )}
        
        <h1 className="text-2xl font-bold text-text mb-4">{title}</h1>
        <p className="text-text-secondary mb-8">{message}</p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Tentar Novamente
            </button>
          )}
          
          {showBackButton && (
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-primary text-text font-medium rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          )}
          
          {showHomeButton && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-primary text-text font-medium rounded-xl transition-colors"
            >
              <Home className="w-5 h-5" />
              Ir para Home
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// 404 - Not Found
export function NotFoundError({ resourceName = 'página' }: { resourceName?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-blue-500" />
        </div>
        
        <p className="text-8xl font-bold text-text/10 mb-2">404</p>
        
        <h1 className="text-2xl font-bold text-text mb-4">
          {resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} não encontrada
        </h1>
        <p className="text-text-secondary mb-8">
          A {resourceName} que você está procurando não existe ou foi removida.
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
          >
            <Search className="w-5 h-5" />
            Ver Produtos
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-primary text-text font-medium rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// Network Error
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-orange-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-text mb-4">
          Sem conexão
        </h1>
        <p className="text-text-secondary mb-8">
          Verifique sua conexão com a internet e tente novamente.
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </button>
        )}
      </motion.div>
    </div>
  );
}

// Server Error
export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ServerOff className="w-10 h-10 text-red-500" />
        </div>
        
        <p className="text-8xl font-bold text-text/10 mb-2">500</p>
        
        <h1 className="text-2xl font-bold text-text mb-4">
          Erro no servidor
        </h1>
        <p className="text-text-secondary mb-8">
          Nossos servidores estão enfrentando problemas. Por favor, tente novamente em alguns minutos.
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Tentar Novamente
            </button>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-primary text-text font-medium rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// Unauthorized Error
export function UnauthorizedError() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-yellow-600" />
        </div>
        
        <p className="text-8xl font-bold text-text/10 mb-2">401</p>
        
        <h1 className="text-2xl font-bold text-text mb-4">
          Acesso não autorizado
        </h1>
        <p className="text-text-secondary mb-8">
          Você precisa estar logado para acessar esta página.
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
          >
            Fazer Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-primary text-text font-medium rounded-xl transition-colors"
          >
            Criar Conta
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// Empty State
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ 
  icon: Icon = FileQuestion, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      {description && (
        <p className="text-text-secondary text-center max-w-sm mb-6">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

// Inline error message
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className = '' }: InlineErrorProps) {
  return (
    <div className={`flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl ${className}`}>
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <p className="text-sm text-red-700 flex-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}

// Toast-style error notification
interface ErrorToastProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

export function ErrorToast({ title = 'Erro', message, onClose }: ErrorToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start gap-3 p-4 bg-white border border-red-200 rounded-xl shadow-lg max-w-sm"
    >
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-red-500" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-text">{title}</h4>
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}
