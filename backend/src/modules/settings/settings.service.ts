import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateSettingsDto, UpdateIntegrationsDto, UpdateRolePermissionDto } from './dto';
import { Role, SystemModule, AccessLevel } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);
  private readonly encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32';

  constructor(private prisma: PrismaService) {}

  // Criptografia simples para dados sensíveis
  private encrypt(text: string): string {
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(text: string): string {
    try {
      const [ivHex, encrypted] = text.split(':');
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return '';
    }
  }

  // Buscar ou criar configurações padrão
  async getSettings() {
    let settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await this.prisma.systemSettings.create({
        data: { id: 'default' },
      });
    }

    // Não retornar senhas/chaves criptografadas, apenas indicar se estão configuradas
    return {
      ...settings,
      stripeSecretKey: settings.stripeSecretKey ? '••••••••' : null,
      stripePublicKey: settings.stripePublicKey || null,
      stripeWebhookSecret: settings.stripeWebhookSecret ? '••••••••' : null,
      cloudinaryCloudName: settings.cloudinaryCloudName || null,
      cloudinaryApiKey: settings.cloudinaryApiKey || null,
      cloudinaryApiSecret: settings.cloudinaryApiSecret ? '••••••••' : null,
      smtpPassword: settings.smtpPassword ? '••••••••' : null,
      // Campos para indicar se está configurado
      hasStripeConfig: !!(settings.stripeSecretKey && settings.stripePublicKey),
      hasCloudinaryConfig: !!(settings.cloudinaryCloudName && settings.cloudinaryApiKey && settings.cloudinaryApiSecret),
      hasSmtpConfig: !!(settings.smtpHost && settings.smtpUser),
    };
  }

  // Buscar configurações públicas (sem dados sensíveis)
  async getPublicSettings() {
    const settings = await this.getSettings();
    return {
      companyName: settings.companyName,
      taxRate: settings.taxRate,
      stripeRate: settings.stripeRate,
      stripeFixedFee: settings.stripeFixedFee,
      defaultProfitMargin: settings.defaultProfitMargin,
      useDollarRate: settings.useDollarRate,
      dollarSpread: settings.dollarSpread,
      defaultMaxInstallments: settings.defaultMaxInstallments,
      maxInstallmentsNoFee: settings.maxInstallmentsNoFee,
      minInstallmentValue: settings.minInstallmentValue,
      lastDollarRate: settings.lastDollarRate,
      lastDollarRateAt: settings.lastDollarRateAt,
    };
  }

  // Atualizar configurações gerais
  async updateSettings(dto: UpdateSettingsDto) {
    return this.prisma.systemSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...dto },
      update: dto,
    });
  }

  // Atualizar integrações (com criptografia para dados sensíveis)
  async updateIntegrations(dto: UpdateIntegrationsDto) {
    const dataToUpdate: any = {};

    // Criptografar campos sensíveis se fornecidos
    if (dto.stripeSecretKey && dto.stripeSecretKey !== '••••••••') {
      dataToUpdate.stripeSecretKey = this.encrypt(dto.stripeSecretKey);
    }
    if (dto.stripePublicKey) {
      dataToUpdate.stripePublicKey = dto.stripePublicKey; // Chave pública não precisa criptografar
    }
    if (dto.stripeWebhookSecret && dto.stripeWebhookSecret !== '••••••••') {
      dataToUpdate.stripeWebhookSecret = this.encrypt(dto.stripeWebhookSecret);
    }
    if (dto.cloudinaryCloudName) {
      dataToUpdate.cloudinaryCloudName = dto.cloudinaryCloudName;
    }
    if (dto.cloudinaryApiKey) {
      dataToUpdate.cloudinaryApiKey = dto.cloudinaryApiKey;
    }
    if (dto.cloudinaryApiSecret && dto.cloudinaryApiSecret !== '••••••••') {
      dataToUpdate.cloudinaryApiSecret = this.encrypt(dto.cloudinaryApiSecret);
    }
    if (dto.smtpHost) {
      dataToUpdate.smtpHost = dto.smtpHost;
    }
    if (dto.smtpPort) {
      dataToUpdate.smtpPort = dto.smtpPort;
    }
    if (dto.smtpUser) {
      dataToUpdate.smtpUser = dto.smtpUser;
    }
    if (dto.smtpPassword && dto.smtpPassword !== '••••••••') {
      dataToUpdate.smtpPassword = this.encrypt(dto.smtpPassword);
    }
    if (dto.smtpFrom) {
      dataToUpdate.smtpFrom = dto.smtpFrom;
    }

    return this.prisma.systemSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...dataToUpdate },
      update: dataToUpdate,
    });
  }

  // Buscar credenciais descriptografadas (uso interno)
  async getDecryptedCredentials(type: 'stripe' | 'cloudinary' | 'smtp') {
    const settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) return null;

    switch (type) {
      case 'stripe':
        return {
          secretKey: settings.stripeSecretKey ? this.decrypt(settings.stripeSecretKey) : null,
          publicKey: settings.stripePublicKey,
          webhookSecret: settings.stripeWebhookSecret ? this.decrypt(settings.stripeWebhookSecret) : null,
        };
      case 'cloudinary':
        return {
          cloudName: settings.cloudinaryCloudName,
          apiKey: settings.cloudinaryApiKey,
          apiSecret: settings.cloudinaryApiSecret ? this.decrypt(settings.cloudinaryApiSecret) : null,
        };
      case 'smtp':
        return {
          host: settings.smtpHost,
          port: settings.smtpPort,
          user: settings.smtpUser,
          password: settings.smtpPassword ? this.decrypt(settings.smtpPassword) : null,
          from: settings.smtpFrom,
        };
    }
  }

  // ========== COTAÇÃO DO DÓLAR ==========
  async fetchDollarRate(): Promise<number> {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
      const data = await response.json();
      const rate = parseFloat(data.USDBRL.bid);

      // Atualizar cache
      await this.prisma.systemSettings.upsert({
        where: { id: 'default' },
        create: { 
          id: 'default',
          lastDollarRate: rate,
          lastDollarRateAt: new Date(),
        },
        update: {
          lastDollarRate: rate,
          lastDollarRateAt: new Date(),
        },
      });

      this.logger.log(`Cotação do dólar atualizada: R$ ${rate}`);
      return rate;
    } catch (error) {
      this.logger.error('Erro ao buscar cotação do dólar', error);
      
      // Tentar usar cotação cacheada
      const settings = await this.prisma.systemSettings.findUnique({
        where: { id: 'default' },
      });
      
      if (settings?.lastDollarRate) {
        return Number(settings.lastDollarRate);
      }
      
      // Fallback para cotação padrão
      return 5.0;
    }
  }

  async getDollarRate(): Promise<{ rate: number; updatedAt: Date | null; source: string }> {
    const settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'default' },
    });

    // Se não usar cotação automática, retornar manual
    if (!settings?.useDollarRate && settings?.manualDollarRate) {
      return {
        rate: Number(settings.manualDollarRate),
        updatedAt: null,
        source: 'manual',
      };
    }

    // Verificar se cotação está atualizada (menos de 1 hora)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (settings?.lastDollarRate && settings?.lastDollarRateAt && settings.lastDollarRateAt > oneHourAgo) {
      let rate = Number(settings.lastDollarRate);
      
      // Aplicar spread se configurado
      if (settings.dollarSpread) {
        rate = rate * (1 + Number(settings.dollarSpread) / 100);
      }
      
      return {
        rate,
        updatedAt: settings.lastDollarRateAt,
        source: 'api-cached',
      };
    }

    // Buscar nova cotação
    const rate = await this.fetchDollarRate();
    let finalRate = rate;
    
    if (settings?.dollarSpread) {
      finalRate = rate * (1 + Number(settings.dollarSpread) / 100);
    }
    
    return {
      rate: finalRate,
      updatedAt: new Date(),
      source: 'api-fresh',
    };
  }

  // ========== PERMISSÕES POR ROLE ==========
  async getPermissions() {
    return this.prisma.rolePermission.findMany({
      orderBy: [{ role: 'asc' }, { module: 'asc' }],
    });
  }

  async getPermissionsByRole(role: Role) {
    return this.prisma.rolePermission.findMany({
      where: { role },
    });
  }

  async setPermission(dto: UpdateRolePermissionDto) {
    return this.prisma.rolePermission.upsert({
      where: {
        role_module: {
          role: dto.role as Role,
          module: dto.module as SystemModule,
        },
      },
      create: {
        role: dto.role as Role,
        module: dto.module as SystemModule,
        accessLevel: dto.accessLevel as AccessLevel,
      },
      update: {
        accessLevel: dto.accessLevel as AccessLevel,
      },
    });
  }

  async initializeDefaultPermissions() {
    const defaultPermissions = [
      // ADMIN - Acesso total a tudo
      { role: Role.ADMIN, module: SystemModule.DASHBOARD, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.PRODUCTS, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.CATEGORIES, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.BRANDS, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.ORDERS, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.CUSTOMERS, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.REVIEWS, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.REPORTS, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.SETTINGS, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.INTEGRATIONS, accessLevel: AccessLevel.FULL },
      { role: Role.ADMIN, module: SystemModule.USERS, accessLevel: AccessLevel.FULL },
      
      // GERENTE - Visualiza tudo, edita alguns
      { role: Role.GERENTE, module: SystemModule.DASHBOARD, accessLevel: AccessLevel.VIEW },
      { role: Role.GERENTE, module: SystemModule.PRODUCTS, accessLevel: AccessLevel.EDIT },
      { role: Role.GERENTE, module: SystemModule.CATEGORIES, accessLevel: AccessLevel.EDIT },
      { role: Role.GERENTE, module: SystemModule.BRANDS, accessLevel: AccessLevel.EDIT },
      { role: Role.GERENTE, module: SystemModule.ORDERS, accessLevel: AccessLevel.EDIT },
      { role: Role.GERENTE, module: SystemModule.CUSTOMERS, accessLevel: AccessLevel.VIEW },
      { role: Role.GERENTE, module: SystemModule.REVIEWS, accessLevel: AccessLevel.EDIT },
      { role: Role.GERENTE, module: SystemModule.REPORTS, accessLevel: AccessLevel.VIEW },
      { role: Role.GERENTE, module: SystemModule.SETTINGS, accessLevel: AccessLevel.NONE },
      { role: Role.GERENTE, module: SystemModule.INTEGRATIONS, accessLevel: AccessLevel.NONE },
      { role: Role.GERENTE, module: SystemModule.USERS, accessLevel: AccessLevel.VIEW },
      
      // VENDEDOR - Apenas Produtos e Pedidos
      { role: Role.VENDEDOR, module: SystemModule.DASHBOARD, accessLevel: AccessLevel.VIEW },
      { role: Role.VENDEDOR, module: SystemModule.PRODUCTS, accessLevel: AccessLevel.VIEW },
      { role: Role.VENDEDOR, module: SystemModule.CATEGORIES, accessLevel: AccessLevel.NONE },
      { role: Role.VENDEDOR, module: SystemModule.BRANDS, accessLevel: AccessLevel.NONE },
      { role: Role.VENDEDOR, module: SystemModule.ORDERS, accessLevel: AccessLevel.VIEW },
      { role: Role.VENDEDOR, module: SystemModule.CUSTOMERS, accessLevel: AccessLevel.NONE },
      { role: Role.VENDEDOR, module: SystemModule.REVIEWS, accessLevel: AccessLevel.NONE },
      { role: Role.VENDEDOR, module: SystemModule.REPORTS, accessLevel: AccessLevel.NONE },
      { role: Role.VENDEDOR, module: SystemModule.SETTINGS, accessLevel: AccessLevel.NONE },
      { role: Role.VENDEDOR, module: SystemModule.INTEGRATIONS, accessLevel: AccessLevel.NONE },
      { role: Role.VENDEDOR, module: SystemModule.USERS, accessLevel: AccessLevel.NONE },
    ];

    for (const perm of defaultPermissions) {
      await this.prisma.rolePermission.upsert({
        where: {
          role_module: {
            role: perm.role,
            module: perm.module,
          },
        },
        create: perm,
        update: {}, // Não atualizar se já existir
      });
    }

    return { message: 'Permissões padrão inicializadas' };
  }

  // ========== CÁLCULO DE PREÇOS ==========
  async calculatePrices(params: {
    costPrice?: number;       // Preço de custo
    priceInDollar?: number;   // Preço em dólar (se aplicável)
    desiredProfit?: number;   // % de lucro desejado
    discountPercent?: number; // % de desconto
    customInstallments?: number; // Parcelas customizadas
  }) {
    const settings = await this.getSettings();
    const dollarData = await this.getDollarRate();
    
    const taxRate = Number(settings.taxRate) / 100;
    const stripeRate = Number(settings.stripeRate) / 100;
    const stripeFixed = Number(settings.stripeFixedFee);
    const profitMargin = (params.desiredProfit ?? Number(settings.defaultProfitMargin)) / 100;
    
    let basePrice = params.costPrice || 0;
    
    // Se tem preço em dólar, converter
    if (params.priceInDollar) {
      basePrice = params.priceInDollar * dollarData.rate;
    }
    
    // Calcular preço com margem de lucro
    const priceWithProfit = basePrice * (1 + profitMargin);
    
    // Adicionar impostos (15%)
    const priceWithTax = priceWithProfit * (1 + taxRate);
    
    // Adicionar taxa Stripe (para calcular o preço que cobre a taxa)
    // Fórmula: preçoFinal = (preçoDesejado + taxaFixa) / (1 - taxaPercentual)
    const finalPrice = (priceWithTax + stripeFixed) / (1 - stripeRate);
    
    // Aplicar desconto se houver
    const discountPercent = params.discountPercent || 0;
    const discountedPrice = finalPrice * (1 - discountPercent / 100);
    
    // Calcular lucro real
    const stripeFee = discountedPrice * stripeRate + stripeFixed;
    const taxAmount = discountedPrice * (taxRate / (1 + taxRate)); // Imposto dentro do preço
    const realProfit = discountedPrice - stripeFee - basePrice;
    const realProfitMargin = basePrice > 0 ? (realProfit / basePrice) * 100 : 0;
    
    // Calcular parcelamento
    const maxInstallments = params.customInstallments ?? settings.defaultMaxInstallments;
    const noFeeInstallments = settings.maxInstallmentsNoFee;
    const minInstallmentValue = Number(settings.minInstallmentValue);
    
    const installmentOptions = [];
    for (let i = 1; i <= maxInstallments; i++) {
      const installmentValue = discountedPrice / i;
      if (installmentValue >= minInstallmentValue || i === 1) {
        installmentOptions.push({
          installments: i,
          value: installmentValue,
          noFee: i <= noFeeInstallments,
          total: discountedPrice,
        });
      }
    }
    
    return {
      // Preços
      costPrice: basePrice,
      priceWithProfit: Math.round(priceWithProfit * 100) / 100,
      priceWithTax: Math.round(priceWithTax * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      discountedPrice: Math.round(discountedPrice * 100) / 100,
      
      // Detalhamento de taxas
      breakdown: {
        base: basePrice,
        profitAdded: Math.round((priceWithProfit - basePrice) * 100) / 100,
        taxAdded: Math.round((priceWithTax - priceWithProfit) * 100) / 100,
        stripeFeeEstimated: Math.round(stripeFee * 100) / 100,
      },
      
      // Lucro
      profit: {
        value: Math.round(realProfit * 100) / 100,
        margin: Math.round(realProfitMargin * 100) / 100,
      },
      
      // Cotação do dólar usada
      dollarRate: {
        value: dollarData.rate,
        source: dollarData.source,
        updatedAt: dollarData.updatedAt,
      },
      
      // Parcelamento
      installments: installmentOptions,
      
      // Taxas aplicadas
      rates: {
        tax: Number(settings.taxRate),
        stripe: Number(settings.stripeRate),
        stripeFixed: Number(settings.stripeFixedFee),
        profitMargin: profitMargin * 100,
        discountPercent,
      },
    };
  }

  // ========== LOGS DE ATIVIDADE ==========
  async logActivity(params: {
    userId: string;
    action: string;
    module: string;
    entityId?: string;
    entityType?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.activityLog.create({
      data: params,
    });
  }

  async getActivityLogs(params: {
    userId?: string;
    module?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.module) where.module = params.module;
    if (params.action) where.action = params.action;
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = params.startDate;
      if (params.endDate) where.createdAt.lte = params.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
