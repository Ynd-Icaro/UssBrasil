'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Eye } from 'lucide-react';
import { Badge, Skeleton } from '@/components/ui';
import api from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, formatDate, cn } from '@/lib/utils';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'error' | 'warning' }> = {
  PENDING: { label: 'Pendente', variant: 'warning' },
  PROCESSING: { label: 'Processando', variant: 'secondary' },
  SHIPPED: { label: 'Enviado', variant: 'default' },
  DELIVERED: { label: 'Entregue', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'error' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Meus Pedidos</h1>
        <p className="text-text-secondary">
          Acompanhe o status dos seus pedidos
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <Package className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Nenhum pedido encontrado
          </h2>
          <p className="text-text-secondary mb-6">
            Você ainda não realizou nenhum pedido.
          </p>
          <Link
            href="/products"
            className="text-primary hover:underline"
          >
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.PENDING;
            
            return (
              <div
                key={order.id}
                className="bg-surface rounded-xl border border-border p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-semibold">Pedido #{order.orderNumber}</p>
                    <p className="text-sm text-text-secondary">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                    {order.items?.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-surface"
                      >
                        <Image
                          src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                          alt={item.product?.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.items && order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-lg bg-background border-2 border-surface flex items-center justify-center text-sm font-medium">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary">
                      {order.items?.length} {order.items?.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                  <p className="font-semibold text-primary">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalhes
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
