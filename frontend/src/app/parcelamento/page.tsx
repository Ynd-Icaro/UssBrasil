'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Calculator,
  CheckCircle,
  Info,
  Percent,
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface InstallmentRate {
  installments: number;
  rate: number;
  minValue: number;
}

// Taxas padrão do Stripe para Brasil
const defaultRates: InstallmentRate[] = [
  { installments: 1, rate: 0, minValue: 0 },
  { installments: 2, rate: 0, minValue: 100 },
  { installments: 3, rate: 0, minValue: 150 },
  { installments: 4, rate: 2.99, minValue: 200 },
  { installments: 5, rate: 3.99, minValue: 250 },
  { installments: 6, rate: 4.99, minValue: 300 },
  { installments: 7, rate: 5.99, minValue: 350 },
  { installments: 8, rate: 6.99, minValue: 400 },
  { installments: 9, rate: 7.99, minValue: 450 },
  { installments: 10, rate: 8.99, minValue: 500 },
  { installments: 11, rate: 9.99, minValue: 550 },
  { installments: 12, rate: 10.99, minValue: 600 },
];

const paymentMethods = [
  {
    name: 'Cartão de Crédito',
    description: 'Visa, Mastercard, Elo, American Express, Hipercard',
    icon: CreditCard,
    features: ['Até 12x', 'Aprovação instantânea', 'Todas as bandeiras'],
  },
  {
    name: 'PIX',
    description: 'Pagamento instantâneo com desconto',
    icon: DollarSign,
    features: ['5% de desconto', 'Confirmação imediata', 'Seguro'],
  },
  {
    name: 'Boleto Bancário',
    description: 'Vencimento em 3 dias úteis',
    icon: Calendar,
    features: ['À vista', 'Compensação em 1-2 dias', 'Todos os bancos'],
  },
];

export default function ParcelamentoPage() {
  const [productValue, setProductValue] = useState<number>(500);
  const [rates, setRates] = useState<InstallmentRate[]>(defaultRates);

  const calculateInstallment = (value: number, installments: number, rate: number) => {
    if (rate === 0) return value / installments;
    const monthlyRate = rate / 100 / 12;
    return (value * monthlyRate * Math.pow(1 + monthlyRate, installments)) / (Math.pow(1 + monthlyRate, installments) - 1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const availableInstallments = rates.filter((r) => productValue >= r.minValue);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-surface border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Facilidades de Pagamento</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Parcelamento e Formas de Pagamento
            </h1>
            <p className="text-xl text-text-secondary">
              Conheça todas as opções para pagar suas compras na USS Brasil
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface rounded-2xl border border-border p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Simulador de Parcelamento</h2>
                  <p className="text-text-secondary text-sm">Veja as parcelas para o valor desejado</p>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Valor do produto
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">R$</span>
                  <input
                    type="number"
                    value={productValue}
                    onChange={(e) => setProductValue(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-2xl font-bold text-foreground focus:outline-none focus:border-primary"
                    min={0}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[100, 300, 500, 1000, 2000].map((value) => (
                    <button
                      key={value}
                      onClick={() => setProductValue(value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        productValue === value
                          ? 'bg-primary text-black'
                          : 'bg-surface-hover text-text-secondary hover:text-foreground'
                      }`}
                    >
                      {formatCurrency(value)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableInstallments.map((rate) => {
                  const installmentValue = calculateInstallment(
                    productValue,
                    rate.installments,
                    rate.rate
                  );
                  const totalValue = installmentValue * rate.installments;
                  const isInterestFree = rate.rate === 0;

                  return (
                    <motion.div
                      key={rate.installments}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl border transition-all ${
                        isInterestFree
                          ? 'bg-success/5 border-success/30'
                          : 'bg-surface-hover border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-foreground">
                          {rate.installments}x
                        </span>
                        {isInterestFree && (
                          <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
                            Sem juros
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-semibold text-foreground">
                        {formatCurrency(installmentValue)}
                      </p>
                      {!isInterestFree && (
                        <p className="text-xs text-text-muted mt-1">
                          Total: {formatCurrency(totalValue)} ({rate.rate}% a.m.)
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {productValue < 100 && (
                <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-warning">
                    O valor mínimo para parcelamento é de R$ 100,00
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Formas de Pagamento
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Oferecemos diversas opções para você escolher a melhor forma de pagar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl border border-border p-6 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{method.name}</h3>
                <p className="text-text-secondary text-sm mb-4">{method.description}</p>
                <ul className="space-y-2">
                  {method.features.map((feature) => (
                    <li key={feature} className="flex items-center justify-center gap-2 text-sm text-text-muted">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installment Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Tabela de Parcelamento
              </h2>
              <p className="text-text-secondary">
                Confira as taxas e condições para cada parcela
              </p>
            </div>

            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-hover">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Parcelas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Taxa
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Valor Mínimo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Condição
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rates.map((rate) => (
                    <tr key={rate.installments} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-foreground">
                          {rate.installments}x
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {rate.rate === 0 ? (
                          <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full">
                            Sem juros
                          </span>
                        ) : (
                          <span className="text-text-secondary">
                            {rate.rate}% a.m.
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {rate.minValue === 0 ? 'Sem mínimo' : formatCurrency(rate.minValue)}
                      </td>
                      <td className="px-6 py-4">
                        {rate.installments <= 3 ? (
                          <span className="text-success text-sm">✓ Todas as compras</span>
                        ) : (
                          <span className="text-text-muted text-sm">
                            Acima de {formatCurrency(rate.minValue)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Percent className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Desconto à vista!
                  </h3>
                  <p className="text-text-secondary">
                    Pagando via <strong>PIX</strong>, você ganha <strong className="text-primary">5% de desconto</strong> em 
                    toda a loja. O desconto é aplicado automaticamente no checkout.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Pronto para comprar?
            </h2>
            <p className="text-text-secondary mb-8">
              Navegue pelos nossos produtos e aproveite as condições especiais
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-primary text-black font-bold rounded-xl inline-flex items-center gap-2"
              >
                Ver Produtos
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
