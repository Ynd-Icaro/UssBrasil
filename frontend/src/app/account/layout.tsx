'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const menuItems = [
  { 
    href: '/account', 
    label: 'Minha Conta', 
    icon: User,
    description: 'Informações pessoais'
  },
  { 
    href: '/account/orders', 
    label: 'Meus Pedidos', 
    icon: Package,
    description: 'Histórico de compras'
  },
  { 
    href: '/account/addresses', 
    label: 'Endereços', 
    icon: MapPin,
    description: 'Gerenciar endereços'
  },
  { 
    href: '/account/wishlist', 
    label: 'Lista de Desejos', 
    icon: Heart,
    description: 'Produtos salvos'
  },
  { 
    href: '/account/settings', 
    label: 'Configurações', 
    icon: Settings,
    description: 'Preferências da conta'
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* User Info */}
              <div className="p-6 bg-surface rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-text-secondary truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-surface rounded-xl border border-border overflow-hidden">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover border-b border-border last:border-0 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-text-secondary" />
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-text-secondary">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary" />
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover text-error transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
