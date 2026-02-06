import api from './api';

export interface DollarRateResponse {
  rate: number;
  updatedAt: string | null;
  source: 'manual' | 'api-cached' | 'api-fresh';
}

export interface InstallmentOption {
  installments: number;
  value: number;
  noFee: boolean;
  total: number;
}

export interface PriceBreakdown {
  // Custo Base
  costPrice: number;            // Preço de custo (USD convertido se aplicável)
  dollarRate?: number;          // Taxa do dólar usada (se produto importado)
  
  // Taxas e Deduções
  taxRate: number;              // Taxa de imposto (%)
  taxAmount: number;            // Valor do imposto
  stripeRate: number;           // Taxa Stripe (%)
  stripeFixed: number;          // Taxa fixa Stripe
  stripeAmount: number;         // Total taxa Stripe
  totalFees: number;            // Total de taxas
  
  // Valores Finais
  deviceValue: number;          // Valor do Dispositivo (preço de venda)
  feesValue: number;            // Valor das Taxas
  realValue: number;            // Valor Real (o que recebemos)
  idealValue: number;           // Valor Ideal (com lucro desejado)
  
  // Lucro
  profit: number;               // Lucro líquido
  profitMargin: number;         // Margem de lucro (%)
  desiredProfitMargin: number;  // Margem desejada (%)
  
  // Parcelamento
  installments: InstallmentOption[];
}

// Legacy type for compatibility
export type PriceCalculation = PriceBreakdown;

export interface PublicSettings {
  companyName: string;
  taxRate: number;
  stripeRate: number;
  stripeFixedFee: number;
  defaultProfitMargin: number;
  useDollarRate: boolean;
  dollarSpread: number;
  defaultMaxInstallments: number;
  maxInstallmentsNoFee: number;
  minInstallmentValue: number;
  lastDollarRate: number | null;
  lastDollarRateAt: string | null;
}

// Cache para configurações
let settingsCache: PublicSettings | null = null;
let settingsCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Cache para cotação do dólar
let dollarCache: DollarRateResponse | null = null;
let dollarCacheTime: number = 0;
const DOLLAR_CACHE_DURATION = 60 * 1000; // 1 minuto

// Buscar configurações públicas
export async function getPublicSettings(): Promise<PublicSettings> {
  const now = Date.now();
  
  if (settingsCache && (now - settingsCacheTime) < CACHE_DURATION) {
    return settingsCache;
  }
  
  try {
    const response = await api.get('/settings/public');
    settingsCache = response.data;
    settingsCacheTime = now;
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Retornar defaults se falhar
    return {
      companyName: 'USS Brasil',
      taxRate: 15,
      stripeRate: 3.99,
      stripeFixedFee: 0.39,
      defaultProfitMargin: 30,
      useDollarRate: true,
      dollarSpread: 0,
      defaultMaxInstallments: 12,
      maxInstallmentsNoFee: 3,
      minInstallmentValue: 50,
      lastDollarRate: 5.0,
      lastDollarRateAt: null,
    };
  }
}

// Buscar cotação do dólar com cache
export async function getDollarRate(forceRefresh = false): Promise<DollarRateResponse> {
  const now = Date.now();
  
  if (!forceRefresh && dollarCache && (now - dollarCacheTime) < DOLLAR_CACHE_DURATION) {
    return dollarCache;
  }
  
  try {
    const response = await api.get('/settings/dollar-rate');
    dollarCache = response.data;
    dollarCacheTime = now;
    return response.data;
  } catch (error) {
    console.error('Error fetching dollar rate:', error);
    return {
      rate: 5.0,
      updatedAt: null,
      source: 'manual',
    };
  }
}

// Atualizar cotação do dólar (forçar refresh)
export async function refreshDollarRate(): Promise<DollarRateResponse> {
  try {
    const response = await api.post('/settings/refresh-dollar');
    const data = response.data;
    dollarCache = data;
    dollarCacheTime = Date.now();
    return data;
  } catch (error) {
    console.error('Error refreshing dollar rate:', error);
    return getDollarRate(true);
  }
}

export interface CalculatePriceParams {
  costPrice?: number;           // Preço de custo em BRL
  priceInDollar?: number;       // Preço em USD (opcional para produtos importados)
  dollarRate?: number;          // Taxa do dólar (se não fornecido, usa cache)
  taxRate?: number;             // Taxa de imposto (%)
  stripeRate?: number;          // Taxa Stripe (%)
  stripeFixed?: number;         // Taxa fixa Stripe
  profitMargin?: number;        // Margem de lucro desejada (%)
  discountPercent?: number;     // Desconto aplicado (%)
  maxInstallments?: number;     // Máximo de parcelas
  noFeeInstallments?: number;   // Parcelas sem juros
  minInstallmentValue?: number; // Valor mínimo da parcela
}

/**
 * Calcula preços com a nova estrutura:
 * - Valor do Dispositivo: preço de venda final
 * - Valor Taxas: total de taxas (imposto + Stripe)
 * - Valor Real: o que recebemos após descontar taxas
 * - Valor Ideal: preço que precisamos cobrar para ter X% de lucro
 */
export function calculatePricesLocal(params: CalculatePriceParams): PriceBreakdown {
  const {
    costPrice = 0,
    priceInDollar,
    dollarRate = 5.0,
    taxRate = 15,
    stripeRate = 3.99,
    stripeFixed = 0.39,
    profitMargin = 30,
    discountPercent = 0,
    maxInstallments = 12,
    noFeeInstallments = 3,
    minInstallmentValue = 50,
  } = params;

  // Garantir que os valores são números válidos
  const safeTaxRate = Number(taxRate) || 0;
  const safeStripeRate = Number(stripeRate) || 0;
  const safeStripeFixed = Number(stripeFixed) || 0;
  const safeProfitMargin = Number(profitMargin) || 0;
  const safeDiscountPercent = Number(discountPercent) || 0;
  const safeDollarRate = Number(dollarRate) || 5.0;
  const safeMaxInstallments = Number(maxInstallments) || 12;
  const safeNoFeeInstallments = Number(noFeeInstallments) || 3;
  const safeMinInstallmentValue = Number(minInstallmentValue) || 50;

  // Calcular preço base (custo)
  let baseCost = Number(costPrice) || 0;
  if (priceInDollar && Number(priceInDollar) > 0) {
    baseCost = Number(priceInDollar) * safeDollarRate;
  }

  // Se não temos custo, retornar valores zerados
  if (baseCost <= 0) {
    return createEmptyBreakdown(safeTaxRate, safeStripeRate, safeStripeFixed, safeProfitMargin);
  }

  // Calcular o preço ideal para obter a margem de lucro desejada
  // Fórmula: precoIdeal = custo * (1 + margemLucro) / (1 - taxaStripe) + taxaFixaStripe
  // Isso garante que após descontar as taxas, sobrará o lucro desejado
  
  const profitMultiplier = 1 + (safeProfitMargin / 100);
  const taxMultiplier = 1 + (safeTaxRate / 100);
  const stripeMultiplier = 1 - (safeStripeRate / 100);
  
  // Preço ideal = (custo * (1 + lucro) * (1 + imposto) + taxaFixaStripe) / (1 - taxaStripe)
  const idealValue = ((baseCost * profitMultiplier * taxMultiplier) + safeStripeFixed) / stripeMultiplier;
  
  // Aplicar desconto se houver
  const deviceValue = idealValue * (1 - safeDiscountPercent / 100);
  
  // Calcular taxas sobre o preço de venda
  const taxAmount = deviceValue * (safeTaxRate / 100) / (1 + safeTaxRate / 100); // Imposto incluso
  const stripeAmount = deviceValue * (safeStripeRate / 100) + safeStripeFixed;
  const totalFees = taxAmount + stripeAmount;
  
  // Valor real recebido (após descontar TODAS as taxas)
  const realValue = deviceValue - totalFees;
  
  // Lucro líquido
  const profit = realValue - baseCost;
  const actualProfitMargin = baseCost > 0 ? (profit / baseCost) * 100 : 0;

  // Calcular parcelamento
  const installments: InstallmentOption[] = [];
  for (let i = 1; i <= safeMaxInstallments; i++) {
    const value = deviceValue / i;
    if (value >= safeMinInstallmentValue || i === 1) {
      installments.push({
        installments: i,
        value: roundMoney(value),
        noFee: i <= safeNoFeeInstallments,
        total: roundMoney(deviceValue),
      });
    }
  }

  return {
    costPrice: roundMoney(baseCost),
    dollarRate: priceInDollar ? safeDollarRate : undefined,
    
    taxRate: safeTaxRate,
    taxAmount: roundMoney(taxAmount),
    stripeRate: safeStripeRate,
    stripeFixed: safeStripeFixed,
    stripeAmount: roundMoney(stripeAmount),
    totalFees: roundMoney(totalFees),
    
    deviceValue: roundMoney(deviceValue),
    feesValue: roundMoney(totalFees),
    realValue: roundMoney(realValue),
    idealValue: roundMoney(idealValue),
    
    profit: roundMoney(profit),
    profitMargin: roundMoney(actualProfitMargin),
    desiredProfitMargin: safeProfitMargin,
    
    installments,
  };
}

function createEmptyBreakdown(
  taxRate: number, 
  stripeRate: number, 
  stripeFixed: number, 
  profitMargin: number
): PriceBreakdown {
  return {
    costPrice: 0,
    dollarRate: undefined,
    
    taxRate,
    taxAmount: 0,
    stripeRate,
    stripeFixed,
    stripeAmount: 0,
    totalFees: 0,
    
    deviceValue: 0,
    feesValue: 0,
    realValue: 0,
    idealValue: 0,
    
    profit: 0,
    profitMargin: 0,
    desiredProfitMargin: profitMargin,
    
    installments: [],
  };
}

function roundMoney(value: number): number {
  if (!isFinite(value) || isNaN(value)) return 0;
  return Math.round(value * 100) / 100;
}

// Formatar valor em BRL
export function formatBRL(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Formatar porcentagem
export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0,00%';
  }
  return `${value.toFixed(2).replace('.', ',')}%`;
}
