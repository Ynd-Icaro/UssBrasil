'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Clock, Package, MapPin, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ShippingOption {
  id: number;
  name: string;
  company: string;
  price: number;
  deliveryTime: number;
  deliveryRange: { min: number; max: number };
}

interface ShippingCalculatorProps {
  productWeight?: number;
  productDimensions?: { width: number; height: number; length: number };
  productValue: number;
  onSelect?: (option: ShippingOption) => void;
  className?: string;
}

// Mock shipping options for demo (replace with real API call)
const mockShippingOptions: ShippingOption[] = [
  { id: 1, name: 'PAC', company: 'Correios', price: 19.90, deliveryTime: 8, deliveryRange: { min: 5, max: 10 } },
  { id: 2, name: 'SEDEX', company: 'Correios', price: 34.90, deliveryTime: 3, deliveryRange: { min: 2, max: 4 } },
  { id: 3, name: '.Package', company: 'Jadlog', price: 24.90, deliveryTime: 5, deliveryRange: { min: 4, max: 7 } },
  { id: 4, name: 'Expresso', company: 'Azul Cargo', price: 45.90, deliveryTime: 2, deliveryRange: { min: 1, max: 3 } },
];

export function ShippingCalculator({ 
  productWeight = 0.5,
  productDimensions = { width: 20, height: 5, length: 15 },
  productValue,
  onSelect,
  className
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [address, setAddress] = useState<{ city: string; state: string } | null>(null);

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    setError('');
  };

  const calculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      setError('CEP inválido');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setOptions([]);
    setAddress(null);

    try {
      // First, get address from CEP
      const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const addressData = await viaCepResponse.json();
      
      if (addressData.erro) {
        setError('CEP não encontrado');
        setIsLoading(false);
        return;
      }

      setAddress({ city: addressData.localidade, state: addressData.uf });

      // Try real API first, fallback to mock
      try {
        const response = await api.post('/shipping/quote', {
          cepOrigem: '01310100',
          cepDestino: cleanCep,
          peso: productWeight,
          altura: productDimensions.height,
          largura: productDimensions.width,
          comprimento: productDimensions.length,
          valorDeclarado: productValue,
        });
        setOptions(response.data);
      } catch {
        // Use mock data with adjusted prices based on region
        const regionMultiplier = ['SP', 'RJ', 'MG'].includes(addressData.uf) ? 1 : 1.3;
        const adjustedOptions = mockShippingOptions.map(opt => ({
          ...opt,
          price: Math.round(opt.price * regionMultiplier * 100) / 100,
          deliveryRange: {
            min: opt.deliveryRange.min + (regionMultiplier > 1 ? 2 : 0),
            max: opt.deliveryRange.max + (regionMultiplier > 1 ? 3 : 0),
          }
        }));
        setOptions(adjustedOptions);
      }
    } catch (err) {
      setError('Erro ao calcular frete');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (option: ShippingOption) => {
    setSelectedOption(option.id);
    onSelect?.(option);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 text-text-secondary mb-2">
        <Truck className="w-5 h-5" />
        <span className="font-medium">Calcular Frete</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={cep}
            onChange={handleCepChange}
            placeholder="00000-000"
            maxLength={9}
            className="pr-10"
          />
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        </div>
        <Button
          onClick={calculateShipping}
          disabled={cep.replace(/\D/g, '').length !== 8 || isLoading}
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Calcular'
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      {address && (
        <p className="text-sm text-text-muted">
          Entrega para: <span className="text-foreground">{address.city}, {address.state}</span>
        </p>
      )}

      <AnimatePresence>
        {options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(option)}
                className={cn(
                  'w-full p-4 bg-surface rounded-xl border transition-all text-left flex items-center justify-between',
                  selectedOption === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    selectedOption === option.id ? 'bg-primary/10' : 'bg-surface-hover'
                  )}>
                    <Package className={cn(
                      'w-5 h-5',
                      selectedOption === option.id ? 'text-primary' : 'text-text-muted'
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{option.name}</p>
                    <p className="text-sm text-text-muted">{option.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'font-bold',
                    selectedOption === option.id ? 'text-primary' : 'text-foreground'
                  )}>
                    {formatCurrency(option.price)}
                  </p>
                  <p className="text-xs text-text-muted flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {option.deliveryRange.min}-{option.deliveryRange.max} dias úteis
                  </p>
                </div>
              </motion.button>
            ))}

            {/* Free shipping notice */}
            {productValue >= 299 && (
              <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                <p className="text-sm text-success text-center">
                  🎉 Este produto tem <strong>frete grátis</strong> para compras acima de R$ 299!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-text-muted">
        * Prazo de entrega contado a partir da confirmação do pagamento
      </p>
    </div>
  );
}
