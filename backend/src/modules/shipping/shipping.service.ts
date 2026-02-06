import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string; // Ex: "3-5 dias úteis"
  carrier: string;
}

interface PackageDimensions {
  weight: number; // kg
  width: number;  // cm
  height: number; // cm
  length: number; // cm
}

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  private readonly originZipCode: string;
  private readonly freeShippingThreshold: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.originZipCode = this.configService.get('ORIGIN_ZIP_CODE', '88801505');
    this.freeShippingThreshold = this.configService.get('FREE_SHIPPING_THRESHOLD', 299);
  }

  async calculate(calculateShippingDto: CalculateShippingDto): Promise<{
    options: ShippingOption[];
    freeShippingEligible: boolean;
    freeShippingThreshold: number;
  }> {
    const { zipCode, items } = calculateShippingDto;

    // Validar CEP
    const cleanZipCode = zipCode.replace(/\D/g, '');
    if (cleanZipCode.length !== 8) {
      throw new BadRequestException('CEP inválido');
    }

    // Buscar produtos para calcular dimensões
    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        weight: true,
        width: true,
        height: true,
        length: true,
        price: true,
        finalPrice: true,
      },
    });

    // Calcular total do carrinho para verificar frete grátis
    let cartTotal = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const price = product.finalPrice ? Number(product.finalPrice) : Number(product.price);
        cartTotal += price * item.quantity;
      }
    }

    // Calcular dimensões do pacote
    const packageDimensions = this.calculatePackageDimensions(products, items);

    // Verificar elegibilidade para frete grátis
    const freeShippingEligible = cartTotal >= this.freeShippingThreshold;

    // Calcular opções de frete
    const options = await this.calculateShippingOptions(
      cleanZipCode,
      packageDimensions,
      freeShippingEligible,
    );

    return {
      options,
      freeShippingEligible,
      freeShippingThreshold: this.freeShippingThreshold,
    };
  }

  private calculatePackageDimensions(
    products: any[],
    items: { productId: string; quantity: number }[],
  ): PackageDimensions {
    let totalWeight = 0;
    let maxWidth = 0;
    let maxLength = 0;
    let totalHeight = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const weight = product.weight ? Number(product.weight) : 0.3; // Default 300g
        const width = product.width ? Number(product.width) : 15;
        const height = product.height ? Number(product.height) : 5;
        const length = product.length ? Number(product.length) : 20;

        totalWeight += weight * item.quantity;
        maxWidth = Math.max(maxWidth, width);
        maxLength = Math.max(maxLength, length);
        totalHeight += height * item.quantity;
      }
    }

    // Garantir dimensões mínimas
    return {
      weight: Math.max(totalWeight, 0.3),
      width: Math.max(maxWidth, 11), // Mínimo Correios: 11cm
      height: Math.max(totalHeight, 2), // Mínimo Correios: 2cm
      length: Math.max(maxLength, 16), // Mínimo Correios: 16cm
    };
  }

  private async calculateShippingOptions(
    destZipCode: string,
    dimensions: PackageDimensions,
    freeShippingEligible: boolean,
  ): Promise<ShippingOption[]> {
    const options: ShippingOption[] = [];

    // Determinar região para cálculo aproximado
    const region = this.getRegionByZipCode(destZipCode);

    // PAC (Econômico)
    const pacPrice = this.calculatePACPrice(region, dimensions);
    options.push({
      id: 'pac',
      name: 'PAC',
      price: freeShippingEligible ? 0 : pacPrice,
      deliveryTime: this.getPACDeliveryTime(region),
      carrier: 'Correios',
    });

    // SEDEX (Expresso)
    const sedexPrice = this.calculateSEDEXPrice(region, dimensions);
    options.push({
      id: 'sedex',
      name: 'SEDEX',
      price: sedexPrice,
      deliveryTime: this.getSEDEXDeliveryTime(region),
      carrier: 'Correios',
    });

    // Transportadora (para pedidos maiores)
    if (dimensions.weight > 5) {
      const transportadoraPrice = this.calculateTransportadoraPrice(region, dimensions);
      options.push({
        id: 'transportadora',
        name: 'Transportadora',
        price: freeShippingEligible ? 0 : transportadoraPrice,
        deliveryTime: this.getTransportadoraDeliveryTime(region),
        carrier: 'Transportadora',
      });
    }

    // Retirada em loja (se disponível)
    if (this.isLocalDelivery(destZipCode)) {
      options.push({
        id: 'pickup',
        name: 'Retirar na Loja',
        price: 0,
        deliveryTime: 'Disponível em 1 dia útil',
        carrier: 'USS Brasil',
      });
    }

    return options.sort((a, b) => a.price - b.price);
  }

  private getRegionByZipCode(zipCode: string): 'local' | 'sul' | 'sudeste' | 'centro' | 'nordeste' | 'norte' {
    const prefix = parseInt(zipCode.substring(0, 2));

    // Santa Catarina local
    if (prefix >= 88 && prefix <= 89) {
      return 'local';
    }

    // Sul: PR, RS, SC
    if (prefix >= 80 && prefix <= 99) {
      return 'sul';
    }

    // Sudeste: SP, RJ, MG, ES
    if ((prefix >= 1 && prefix <= 39) || (prefix >= 20 && prefix <= 28) || 
        (prefix >= 29 && prefix <= 29) || (prefix >= 30 && prefix <= 39)) {
      return 'sudeste';
    }

    // Centro-Oeste: GO, MT, MS, DF
    if ((prefix >= 70 && prefix <= 73) || (prefix >= 74 && prefix <= 76) || 
        (prefix >= 78 && prefix <= 79)) {
      return 'centro';
    }

    // Nordeste: BA, SE, AL, PE, PB, RN, CE, PI, MA
    if (prefix >= 40 && prefix <= 65) {
      return 'nordeste';
    }

    // Norte: PA, AM, RR, AP, AC, RO, TO
    if (prefix >= 66 && prefix <= 69 || (prefix >= 76 && prefix <= 77)) {
      return 'norte';
    }

    return 'sudeste'; // Default
  }

  private calculatePACPrice(region: string, dimensions: PackageDimensions): number {
    // Preços base aproximados (podem ser ajustados)
    const basePrice: Record<string, number> = {
      local: 15,
      sul: 22,
      sudeste: 28,
      centro: 35,
      nordeste: 42,
      norte: 50,
    };

    const weightMultiplier = Math.max(1, dimensions.weight / 0.5);
    const price = (basePrice[region] || 30) * weightMultiplier;

    return Math.round(price * 100) / 100;
  }

  private calculateSEDEXPrice(region: string, dimensions: PackageDimensions): number {
    // SEDEX é geralmente 2-3x o PAC
    return Math.round(this.calculatePACPrice(region, dimensions) * 2.5 * 100) / 100;
  }

  private calculateTransportadoraPrice(region: string, dimensions: PackageDimensions): number {
    // Transportadoras geralmente são mais baratas para volumes maiores
    return Math.round(this.calculatePACPrice(region, dimensions) * 0.8 * 100) / 100;
  }

  private getPACDeliveryTime(region: string): string {
    const times: Record<string, string> = {
      local: '2-4 dias úteis',
      sul: '3-6 dias úteis',
      sudeste: '5-8 dias úteis',
      centro: '6-10 dias úteis',
      nordeste: '8-12 dias úteis',
      norte: '10-15 dias úteis',
    };
    return times[region] || '5-10 dias úteis';
  }

  private getSEDEXDeliveryTime(region: string): string {
    const times: Record<string, string> = {
      local: '1-2 dias úteis',
      sul: '2-3 dias úteis',
      sudeste: '2-4 dias úteis',
      centro: '3-5 dias úteis',
      nordeste: '4-6 dias úteis',
      norte: '5-8 dias úteis',
    };
    return times[region] || '2-5 dias úteis';
  }

  private getTransportadoraDeliveryTime(region: string): string {
    const times: Record<string, string> = {
      local: '3-5 dias úteis',
      sul: '4-7 dias úteis',
      sudeste: '5-9 dias úteis',
      centro: '7-12 dias úteis',
      nordeste: '10-15 dias úteis',
      norte: '12-18 dias úteis',
    };
    return times[region] || '7-12 dias úteis';
  }

  private isLocalDelivery(zipCode: string): boolean {
    // Criciúma e região
    const prefix = parseInt(zipCode.substring(0, 5));
    return prefix >= 88800 && prefix <= 88820;
  }

  async getAddressByZipCode(zipCode: string) {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      throw new BadRequestException('CEP inválido');
    }

    try {
      // Usando ViaCEP (gratuito)
      const response = await fetch(`https://viacep.com.br/ws/${cleanZipCode}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new BadRequestException('CEP não encontrado');
      }

      return {
        zipCode: data.cep,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        complement: data.complemento,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao consultar CEP');
    }
  }
}
