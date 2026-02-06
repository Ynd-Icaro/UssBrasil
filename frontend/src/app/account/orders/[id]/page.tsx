'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  Check, 
  ChevronLeft,
  MapPin,
  CreditCard,
  CheckCircle
} from 'lucide-react';
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

const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await api.get(`/orders/${params.id}`);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (params.id) {
      loadOrder();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-text-secondary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Pedido não encontrado</h1>
        <p className="text-text-secondary">
          O pedido que você procura não existe.
        </p>
      </div>
    );
  }

  const status = statusMap[order.status] || statusMap.PENDING;
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="space-y-8">
      {/* Success Banner */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success/10 border border-success rounded-xl p-6 flex items-center gap-4"
        >
          <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-success">Pedido realizado com sucesso!</h2>
            <p className="text-sm text-text-secondary">
              Obrigado por sua compra. Você receberá um e-mail de confirmação em breve.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/account/orders"
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Pedido #{order.orderNumber}</h1>
          <p className="text-text-secondary">
            Realizado em {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={status.variant} className="ml-auto">
          {status.label}
        </Badge>
      </div>

      {/* Status Progress */}
      {order.status !== 'CANCELLED' && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-6">Status do Pedido</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const isComplete = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const stepInfo = statusMap[step];

              return (
                <div key={step} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center z-10',
                        isComplete ? 'bg-success text-white' : 'bg-surface border border-border'
                      )}
                    >
                      {isComplete ? (
                        <Check className="w-5 h-5" />
                      ) : index === 0 ? (
                        <Package className="w-5 h-5" />
                      ) : index === 1 ? (
                        <Package className="w-5 h-5" />
                      ) : index === 2 ? (
                        <Truck className="w-5 h-5" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-sm mt-2 text-center',
                        isCurrent ? 'font-medium text-text-primary' : 'text-text-secondary'
                      )}
                    >
                      {stepInfo.label}
                    </p>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={cn(
                        'absolute top-5 left-1/2 w-full h-0.5',
                        index < currentStepIndex ? 'bg-success' : 'bg-border'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-6">Itens do Pedido</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.product?.name || 'Produto'}
                    </Link>
                    {item.variantInfo && (
                      <p className="text-sm text-text-secondary">
                        Variante: {item.variantInfo}
                      </p>
                    )}
                    <p className="text-sm text-text-secondary">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Totals */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Resumo</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Frete</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Desconto</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-surface rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Endereço de Entrega</h2>
              </div>
              <p className="text-text-secondary text-sm">
                {order.address.street}, {order.address.number}
                {order.address.complement && `, ${order.address.complement}`}
                <br />
                {order.address.neighborhood} - {order.address.city}/
                {order.address.state}
                <br />
                CEP: {order.address.zipCode}
              </p>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Pagamento</h2>
            </div>
            <p className="text-text-secondary text-sm">
              Cartão de crédito
              <br />
              Status: {order.payment?.status === 'COMPLETED' ? 'Aprovado' : 'Pendente'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
