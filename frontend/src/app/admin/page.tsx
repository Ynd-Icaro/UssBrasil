'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Image as ImageIcon,
  Layers,
  Settings,
  Tag,
  FolderTree,
  Plus
} from 'lucide-react';
import { Skeleton } from '@/components/ui';
import { QuickAddCategory, QuickAddBrand } from '@/components/admin';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
  productsGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  revenueGrowth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Simulated stats - in production, this would come from API
        const [products, orders, users] = await Promise.all([
          api.get('/products?limit=1'),
          api.get('/orders?limit=5'),
          api.get('/users?limit=1'),
        ]);

        setStats({
          totalProducts: products.data.data.meta?.total || 0,
          totalOrders: orders.data.data.meta?.total || 0,
          totalUsers: users.data.data.meta?.total || 0,
          totalRevenue: 125000,
          recentOrders: orders.data.data.data || [],
          productsGrowth: 12.5,
          ordersGrowth: 8.2,
          usersGrowth: 15.3,
          revenueGrowth: 22.1,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback stats for demo
        setStats({
          totalProducts: 150,
          totalOrders: 320,
          totalUsers: 1250,
          totalRevenue: 125000,
          recentOrders: [],
          productsGrowth: 12.5,
          ordersGrowth: 8.2,
          usersGrowth: 15.3,
          revenueGrowth: 22.1,
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Total de Produtos',
      value: stats?.totalProducts || 0,
      growth: stats?.productsGrowth || 0,
      icon: Package,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Pedidos',
      value: stats?.totalOrders || 0,
      growth: stats?.ordersGrowth || 0,
      icon: ShoppingCart,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      label: 'Usuários',
      value: stats?.totalUsers || 0,
      growth: stats?.usersGrowth || 0,
      icon: Users,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      label: 'Receita Total',
      value: formatPrice(stats?.totalRevenue || 0),
      growth: stats?.revenueGrowth || 0,
      icon: DollarSign,
      color: 'bg-yellow-500/10 text-yellow-500',
      isPrice: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">
          Visão geral do seu negócio
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.growth >= 0;

          return (
            <div
              key={index}
              className="bg-surface rounded-xl border border-border p-6"
            >
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold mb-1">
                    {stat.isPrice ? stat.value : stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-text-secondary text-sm">{stat.label}</p>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        isPositive ? 'text-success' : 'text-error'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(stat.growth)}%
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Pedidos Recentes</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : stats?.recentOrders.length === 0 ? (
            <p className="text-text-secondary text-center py-8">
              Nenhum pedido recente
            </p>
          ) : (
            <div className="space-y-4">
              {stats?.recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-sm text-text-secondary">
                      {order.user?.name || 'Cliente'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <p className="text-sm text-text-secondary">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-6">Ações Rápidas</h2>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/products/new"
              className="p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-center"
            >
              <Package className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-medium">Novo Produto</p>
            </Link>
            
            {/* Quick Add Category */}
            <QuickAddCategory 
              variant="card"
              triggerClassName="bg-green-500/10 hover:bg-green-500/20"
            />

            {/* Quick Add Brand */}
            <QuickAddBrand 
              variant="card"
              triggerClassName="bg-purple-500/10 hover:bg-purple-500/20"
            />

            <Link
              href="/admin/cms"
              className="p-4 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors text-center"
            >
              <ImageIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium">Gerenciar CMS</p>
            </Link>
          </div>

          {/* Additional Quick Links */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-text-secondary mb-4">Mais opções</h3>
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/admin/orders"
                className="p-3 rounded-lg bg-surface-hover hover:bg-surface-hover/80 transition-colors text-center text-sm"
              >
                <ShoppingCart className="w-5 h-5 text-text-secondary mx-auto mb-1" />
                Pedidos
              </Link>
              <Link
                href="/admin/users"
                className="p-3 rounded-lg bg-surface-hover hover:bg-surface-hover/80 transition-colors text-center text-sm"
              >
                <Users className="w-5 h-5 text-text-secondary mx-auto mb-1" />
                Usuários
              </Link>
              <Link
                href="/admin/settings"
                className="p-3 rounded-lg bg-surface-hover hover:bg-surface-hover/80 transition-colors text-center text-sm"
              >
                <Settings className="w-5 h-5 text-text-secondary mx-auto mb-1" />
                Config
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
