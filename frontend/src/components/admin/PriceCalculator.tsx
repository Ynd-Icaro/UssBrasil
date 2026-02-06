'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calculator, DollarSign, RefreshCw, TrendingUp, TrendingDown, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { 
  getDollarRate, 
  refreshDollarRate as apiRefreshDollarRate,
  getPublicSettings, 
  calculatePricesLocal, 
  formatBRL, 
  formatPercent, 
  type PriceBreakdown, 
  type PublicSettings 
} from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface PriceCalculatorProps {
  costPrice?: number;
  priceInDollar?: number;
  onPriceCalculated?: (prices: PriceBreakdown) => void;
  compact?: boolean;
}

export default function PriceCalculator({ 
  costPrice = 0, 
  priceInDollar, 
  onPriceCalculated,
  compact = false,
}: PriceCalculatorProps) {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [dollarRate, setDollarRate] = useState<number>(5.0);
  const [dollarSource, setDollarSource] = useState<string>('');
  const [dollarUpdatedAt, setDollarUpdatedAt] = useState<string | null>(null);
  const [isLoadingDollar, setIsLoadingDollar] = useState(false);
  const [customProfitMargin, setCustomProfitMargin] = useState<number | null>(null);
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [calculation, setCalculation] = useState<PriceBreakdown | null>(null);

  // Carregar configurações e cotação do dólar
  useEffect(() => {
    async function loadData() {
      const [s, dollar] = await Promise.all([
        getPublicSettings(),
        getDollarRate()
      ]);
      setSettings(s);
      setDollarRate(dollar.rate);
      setDollarSource(dollar.source);
      setDollarUpdatedAt(dollar.updatedAt);
    }
    loadData();
  }, []);

  // Atualizar cotação do dólar
  const handleRefreshDollar = useCallback(async () => {
    setIsLoadingDollar(true);
    try {
      const data = await apiRefreshDollarRate();
      setDollarRate(data.rate);
      setDollarSource(data.source);
      setDollarUpdatedAt(data.updatedAt);
    } catch (error) {
      console.error('Error refreshing dollar rate:', error);
    } finally {
      setIsLoadingDollar(false);
    }
  }, []);

  // Calcular preços quando inputs mudam
  useEffect(() => {
    if (!settings) return;

    const calc = calculatePricesLocal({
      costPrice: priceInDollar ? 0 : costPrice,
      priceInDollar,
      dollarRate,
      taxRate: Number(settings.taxRate),
      stripeRate: Number(settings.stripeRate),
      stripeFixed: Number(settings.stripeFixedFee),
      profitMargin: customProfitMargin ?? Number(settings.defaultProfitMargin),
      discountPercent: customDiscount,
      maxInstallments: settings.defaultMaxInstallments,
      noFeeInstallments: settings.maxInstallmentsNoFee,
      minInstallmentValue: Number(settings.minInstallmentValue),
    });

    setCalculation(calc);
    onPriceCalculated?.(calc);
  }, [settings, costPrice, priceInDollar, dollarRate, customProfitMargin, customDiscount, onPriceCalculated]);

  if (!settings || !calculation) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4 h-40" />
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Preço de Venda</span>
          <span className="text-lg font-bold text-primary">{formatBRL(calculation.deviceValue)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Valor Recebido</span>
          <span className="font-medium text-green-600">{formatBRL(calculation.realValue)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Lucro</span>
          <span className={cn(
            "font-medium",
            calculation.profit >= 0 ? "text-success" : "text-error"
          )}>
            {formatBRL(calculation.profit)} ({formatPercent(calculation.profitMargin)})
          </span>
        </div>
        {calculation.installments.length > 0 && (
          <div className="text-xs text-text-secondary">
            em até {calculation.installments.length}x de {formatBRL(calculation.installments[calculation.installments.length - 1]?.value || 0)}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border rounded-xl p-5 space-y-5"
    >
      {/* Header com cotação do dólar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-text-primary">Calculadora de Preços</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm">
            <span className="text-text-secondary">USD:</span>
            <span className="font-medium ml-1 text-green-600">R$ {(dollarRate ?? 5.0).toFixed(4)}</span>
            {dollarSource && (
              <span className="text-xs text-text-tertiary ml-1">
                ({dollarSource === 'api-fresh' ? 'atualizado' : 
                  dollarSource === 'api-cached' ? 'cache' : 'manual'})
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshDollar}
            disabled={isLoadingDollar}
            className="h-8 w-8 p-0"
            title="Atualizar cotação"
          >
            <RefreshCw className={cn("w-4 h-4", isLoadingDollar && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Inputs de configuração */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">Margem de Lucro Desejada (%)</label>
          <input
            type="number"
            value={customProfitMargin ?? Number(settings.defaultProfitMargin)}
            onChange={(e) => setCustomProfitMargin(Number(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            min="0"
            max="500"
            step="1"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">Desconto (%)</label>
          <input
            type="number"
            value={customDiscount}
            onChange={(e) => setCustomDiscount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            min="0"
            max="100"
            step="1"
          />
        </div>
      </div>

      {/* Tabela de Valores */}
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary">Descrição</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-text-secondary">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Custo do Dispositivo */}
            <tr>
              <td className="px-4 py-3">
                <div className="font-medium text-text-primary">Custo do Dispositivo</div>
                <div className="text-xs text-text-tertiary">
                  {priceInDollar 
                    ? `USD ${priceInDollar.toFixed(2)} × R$ ${(dollarRate ?? 5.0).toFixed(4)}` 
                    : 'Preço de custo em BRL'}
                </div>
              </td>
              <td className="px-4 py-3 text-right font-medium">{formatBRL(calculation.costPrice)}</td>
            </tr>

            {/* Margem de Lucro */}
            <tr>
              <td className="px-4 py-3">
                <div className="font-medium text-text-primary">+ Margem de Lucro ({formatPercent(calculation.desiredProfitMargin)})</div>
                <div className="text-xs text-text-tertiary">Lucro desejado sobre o custo</div>
              </td>
              <td className="px-4 py-3 text-right font-medium text-green-600">
                +{formatBRL(calculation.costPrice * (calculation.desiredProfitMargin / 100))}
              </td>
            </tr>

            {/* Impostos */}
            <tr>
              <td className="px-4 py-3">
                <div className="font-medium text-text-primary">+ Impostos ({formatPercent(calculation.taxRate)})</div>
                <div className="text-xs text-text-tertiary">Inclusos no preço de venda</div>
              </td>
              <td className="px-4 py-3 text-right font-medium text-orange-600">
                +{formatBRL(calculation.taxAmount)}
              </td>
            </tr>

            {/* Taxa Stripe */}
            <tr>
              <td className="px-4 py-3">
                <div className="font-medium text-text-primary">+ Taxa Stripe</div>
                <div className="text-xs text-text-tertiary">
                  {formatPercent(calculation.stripeRate)} + {formatBRL(calculation.stripeFixed)} fixo
                </div>
              </td>
              <td className="px-4 py-3 text-right font-medium text-red-600">
                +{formatBRL(calculation.stripeAmount)}
              </td>
            </tr>

            {customDiscount > 0 && (
              <tr>
                <td className="px-4 py-3">
                  <div className="font-medium text-text-primary">- Desconto ({formatPercent(customDiscount)})</div>
                  <div className="text-xs text-text-tertiary">Desconto promocional</div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-primary">
                  -{formatBRL(calculation.idealValue - calculation.deviceValue)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards de Valores Principais */}
      <div className="grid grid-cols-2 gap-4">
        {/* Valor do Dispositivo (Preço de Venda) */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Preço de Venda</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatBRL(calculation.deviceValue)}
          </div>
          <div className="text-xs text-blue-600/70 mt-1">
            Valor cobrado do cliente
          </div>
        </div>

        {/* Valor das Taxas */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Total de Taxas</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {formatBRL(calculation.totalFees)}
          </div>
          <div className="text-xs text-red-600/70 mt-1">
            Impostos + Stripe
          </div>
        </div>

        {/* Valor Real (Recebido) */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Valor Recebido</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatBRL(calculation.realValue)}
          </div>
          <div className="text-xs text-green-600/70 mt-1">
            O que entra no caixa
          </div>
        </div>

        {/* Lucro */}
        <div className={cn(
          "rounded-lg p-4 border",
          calculation.profit >= 0 
            ? "bg-emerald-50 border-emerald-200" 
            : "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center gap-2 mb-1">
            {calculation.profit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={cn(
              "text-sm font-medium",
              calculation.profit >= 0 ? "text-emerald-800" : "text-red-800"
            )}>
              Lucro Líquido
            </span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            calculation.profit >= 0 ? "text-emerald-600" : "text-red-600"
          )}>
            {formatBRL(calculation.profit)}
          </div>
          <div className={cn(
            "text-xs mt-1",
            calculation.profit >= 0 ? "text-emerald-600/70" : "text-red-600/70"
          )}>
            Margem: {formatPercent(calculation.profitMargin)}
          </div>
        </div>
      </div>

      {/* Parcelamento */}
      {calculation.installments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-text-secondary" />
            <h4 className="text-sm font-medium text-text-primary">Parcelamento</h4>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {calculation.installments.slice(0, 12).map((inst) => (
              <div 
                key={inst.installments}
                className={cn(
                  "text-center p-2 rounded-lg border text-xs",
                  inst.noFee 
                    ? "bg-green-50 border-green-200" 
                    : "bg-gray-50 border-border"
                )}
              >
                <div className="font-semibold">{inst.installments}x</div>
                <div className="text-text-secondary">{formatBRL(inst.value)}</div>
                {inst.noFee && (
                  <div className="text-[10px] text-green-600 font-medium">sem juros</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo das taxas */}
      <div className="text-xs text-text-tertiary flex flex-wrap gap-2 pt-2 border-t border-border">
        <span>Impostos: {formatPercent(settings.taxRate)}</span>
        <span>|</span>
        <span>Stripe: {formatPercent(Number(settings.stripeRate))} + {formatBRL(Number(settings.stripeFixedFee))}</span>
        {priceInDollar && (
          <>
            <span>|</span>
            <span>Dólar: R$ {(dollarRate ?? 5.0).toFixed(4)}</span>
          </>
        )}
      </div>
    </motion.div>
  );
}
