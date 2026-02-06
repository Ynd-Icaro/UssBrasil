'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag,
  Building2,
  Settings,
  ChevronRight,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/categories', label: 'Categorias', icon: Tag },
  { href: '/admin/brands', label: 'Marcas', icon: Building2 },
  { href: '/admin/cms', label: 'Conteúdo (CMS)', icon: ImageIcon },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Roles que podem acessar o admin
  const adminRoles = ['ADMIN', 'GERENTE', 'VENDEDOR'];

  useEffect(() => {
    if (!isAuthenticated || !user?.role || !adminRoles.includes(user.role)) {
      router.push('/login?redirect=/admin');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || !user?.role || !adminRoles.includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex-shrink-0 shadow-sm">
        <div className="sticky top-0 h-screen flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/admin" className="text-xl font-bold">
              USS<span className="text-primary">BRASIL</span>
              <span className="text-xs text-text-secondary ml-2 bg-primary/10 px-2 py-1 rounded">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-text-secondary">Administrador</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
