'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  ChevronRight, 
  Check,
  Plus,
  Loader2
} from 'lucide-react';
import { Button, Input, Modal } from '@/components/ui';
import { useCartStore, useAuthStore } from '@/store';
import api from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import { Address } from '@/types';

const addressSchema = z.object({
  street: z.string().min(3, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  zipCode: z.string().min(8, 'CEP inválido'),
});

type AddressFormData = z.infer<typeof addressSchema>;

type Step = 'address' | 'shipping' | 'payment' | 'review';

const steps: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: 'address', label: 'Endereço', icon: MapPin },
  { key: 'shipping', label: 'Entrega', icon: Truck },
  { key: 'payment', label: 'Pagamento', icon: CreditCard },
  { key: 'review', label: 'Revisão', icon: Check },
];

const shippingOptions = [
  { id: 'standard', name: 'Padrão', price: 19.90, days: '7-10 dias úteis' },
  { id: 'express', name: 'Expresso', price: 39.90, days: '3-5 dias úteis' },
  { id: 'overnight', name: 'Overnight', price: 59.90, days: '1-2 dias úteis' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, subtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const cartSubtotal = subtotal();
  const cartTotal = total();
  
  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    async function loadAddresses() {
      try {
        const response = await api.get('/users/addresses');
        const addressData = response.data.data;
        setAddresses(addressData);
        if (addressData.length > 0) {
          const defaultAddr = addressData.find((a: Address) => a.isDefault) || addressData[0];
          setSelectedAddress(defaultAddr);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    }
    loadAddresses();
  }, [isAuthenticated, items.length, router]);

  const shipping = selectedShipping.price;
  const discount = 0;
  const finalTotal = cartSubtotal + shipping - discount;

  const handleAddAddress = async (data: AddressFormData) => {
    try {
      const response = await api.post('/users/addresses', data);
      const newAddress = response.data.data;
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddress(newAddress);
      setIsAddressModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const goToNextStep = () => {
    const stepIndex = steps.findIndex((s) => s.key === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].key);
    }
  };

  const goToPrevStep = () => {
    const stepIndex = steps.findIndex((s) => s.key === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].key);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;

    setIsProcessing(true);
    setError('');

    try {
      const orderData = {
        addressId: selectedAddress.id,
        shippingMethod: selectedShipping.id,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          variantInfo: item.variantInfo,
        })),
      };

      const response = await api.post('/orders', orderData);
      const order = response.data.data;

      // Clear cart after successful order
      clearCart();

      // Redirect to order confirmation
      router.push(`/account/orders/${order.id}?success=true`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar pedido');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-text-secondary">Complete sua compra</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => {
            const isActive = currentStep === step.key;
            const isPast = steps.findIndex((s) => s.key === currentStep) > index;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => isPast && setCurrentStep(step.key)}
                  disabled={!isPast}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                    isActive && 'bg-primary text-white',
                    isPast && 'text-primary hover:bg-primary/10',
                    !isActive && !isPast && 'text-text-secondary'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      isActive && 'bg-white/20',
                      isPast && 'bg-primary/20',
                      !isActive && !isPast && 'bg-surface'
                    )}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 mx-2 text-text-secondary" />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">Endereço de Entrega</h2>

                  {addresses.length > 0 ? (
                    <div className="grid gap-4">
                      {addresses.map((address) => (
                        <button
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={cn(
                            'p-4 rounded-xl border text-left transition-colors',
                            selectedAddress?.id === address.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {address.street}, {address.number}
                              </p>
                              {address.complement && (
                                <p className="text-sm text-text-secondary">
                                  {address.complement}
                                </p>
                              )}
                              <p className="text-sm text-text-secondary">
                                {address.neighborhood} - {address.city}/{address.state}
                              </p>
                              <p className="text-sm text-text-secondary">
                                CEP: {address.zipCode}
                              </p>
                            </div>
                            {selectedAddress?.id === address.id && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-secondary">
                      Você ainda não possui endereços cadastrados.
                    </p>
                  )}

                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar novo endereço
                  </button>

                  <div className="flex justify-end">
                    <Button
                      onClick={goToNextStep}
                      disabled={!selectedAddress}
                    >
                      Continuar
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">Método de Entrega</h2>

                  <div className="grid gap-4">
                    {shippingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedShipping(option)}
                        className={cn(
                          'p-4 rounded-xl border text-left transition-colors',
                          selectedShipping.id === option.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{option.name}</p>
                            <p className="text-sm text-text-secondary">
                              {option.days}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">
                              {formatPrice(option.price)}
                            </span>
                            {selectedShipping.id === option.id && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={goToPrevStep}>
                      Voltar
                    </Button>
                    <Button onClick={goToNextStep}>
                      Continuar
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">Pagamento</h2>

                  <div className="p-6 rounded-xl border border-border bg-surface">
                    <div className="flex items-center gap-4 mb-6">
                      <CreditCard className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-text-secondary">
                          Pagamento seguro via Stripe
                        </p>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm">
                      O pagamento será processado na próxima etapa através do 
                      Stripe, nossa plataforma de pagamento segura.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={goToPrevStep}>
                      Voltar
                    </Button>
                    <Button onClick={goToNextStep}>
                      Revisar Pedido
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">Revisar Pedido</h2>

                  {/* Order Items */}
                  <div className="p-4 rounded-xl border border-border bg-surface">
                    <h3 className="font-medium mb-4">Itens do Pedido</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={`${item.id}-${item.variantInfo || ''}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.product.name}</p>
                            <p className="text-sm text-text-secondary">
                              Qtd: {item.quantity}
                              {item.variantInfo && ` • ${item.variantInfo}`}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="p-4 rounded-xl border border-border bg-surface">
                    <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                    {selectedAddress && (
                      <p className="text-text-secondary">
                        {selectedAddress.street}, {selectedAddress.number}
                        {selectedAddress.complement && `, ${selectedAddress.complement}`}
                        <br />
                        {selectedAddress.neighborhood} - {selectedAddress.city}/
                        {selectedAddress.state}
                        <br />
                        CEP: {selectedAddress.zipCode}
                      </p>
                    )}
                  </div>

                  {/* Shipping Method */}
                  <div className="p-4 rounded-xl border border-border bg-surface">
                    <h3 className="font-medium mb-2">Método de Entrega</h3>
                    <p className="text-text-secondary">
                      {selectedShipping.name} - {selectedShipping.days} •{' '}
                      {formatPrice(selectedShipping.price)}
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-error/10 border border-error text-error">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={goToPrevStep}>
                      Voltar
                    </Button>
                    <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          Finalizar Pedido
                          <Check className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Resumo do Pedido</h2>

              {/* Items Preview */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantInfo || ''}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-text-secondary">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Frete</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Desconto</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Adicionar Endereço"
      >
        <form onSubmit={handleSubmit(handleAddAddress)} className="space-y-4">
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
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddressModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
