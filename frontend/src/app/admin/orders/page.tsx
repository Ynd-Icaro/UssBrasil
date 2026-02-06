'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Truck, Check, X } from 'lucide-react';
import { Button, Input, Badge, Skeleton, Modal } from '@/components/ui';
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [currentPage, search, statusFilter]);

  async function loadOrders() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(currentPage));
      params.append('limit', '10');
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const response = await api.get(`/orders?${params.toString()}`);
      setOrders(response.data.data.data || response.data.data);
      setTotalPages(response.data.data.meta?.totalPages || 1);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      await loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Pedidos</h1>
        <p className="text-text-secondary">
          Gerencie os pedidos da loja
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            type="text"
            placeholder="Buscar por número do pedido..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
        >
          <option value="">Todos os status</option>
          {Object.entries(statusMap).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-medium text-text-secondary">
                Pedido
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                Cliente
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                Data
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                Total
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                Status
              </th>
              <th className="text-right p-4 font-medium text-text-secondary">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-6 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-8 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary">
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = statusMap[order.status] || statusMap.PENDING;
                
                return (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <p className="font-medium">#{order.orderNumber}</p>
                    </td>
                    <td className="p-4">
                      <p>{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Cliente'}</p>
                      <p className="text-sm text-text-secondary">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                'w-10 h-10 rounded-lg font-medium transition-colors',
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-surface hover:bg-surface-hover'
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Pedido #${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant={statusMap[selectedOrder.status]?.variant}>
                {statusMap[selectedOrder.status]?.label}
              </Badge>
              <p className="text-sm text-text-secondary">
                {formatDate(selectedOrder.createdAt)}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Itens do Pedido</h3>
              {selectedOrder.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p>{item.product?.name}</p>
                    <p className="text-sm text-text-secondary">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Frete</span>
                <span>{formatPrice(selectedOrder.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status Actions */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-medium mb-4">Atualizar Status</h3>
              <div className="flex flex-wrap gap-2">
                {selectedOrder.status === 'PENDING' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'PROCESSING')}
                  >
                    <Check className="w-4 h-4" />
                    Processar
                  </Button>
                )}
                {selectedOrder.status === 'PROCESSING' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'SHIPPED')}
                  >
                    <Truck className="w-4 h-4" />
                    Marcar como Enviado
                  </Button>
                )}
                {selectedOrder.status === 'SHIPPED' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'DELIVERED')}
                  >
                    <Check className="w-4 h-4" />
                    Marcar como Entregue
                  </Button>
                )}
                {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'DELIVERED' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')}
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
