import { IsString, IsEmail, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSettingsDto {
  // Informações da empresa
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyDocument?: string;

  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @IsOptional()
  @IsString()
  companyPhone?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  // Configurações de preço
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  taxRate?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  stripeRate?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stripeFixedFee?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  defaultProfitMargin?: number;

  @IsOptional()
  @IsBoolean()
  useDollarRate?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  manualDollarRate?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  dollarSpread?: number;

  // Parcelamento
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(24)
  defaultMaxInstallments?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(12)
  maxInstallmentsNoFee?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  minInstallmentValue?: number;
}

export class UpdateIntegrationsDto {
  @IsOptional()
  @IsString()
  stripeSecretKey?: string;

  @IsOptional()
  @IsString()
  stripePublicKey?: string;

  @IsOptional()
  @IsString()
  stripeWebhookSecret?: string;

  @IsOptional()
  @IsString()
  cloudinaryCloudName?: string;

  @IsOptional()
  @IsString()
  cloudinaryApiKey?: string;

  @IsOptional()
  @IsString()
  cloudinaryApiSecret?: string;

  @IsOptional()
  @IsString()
  smtpHost?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  smtpPort?: number;

  @IsOptional()
  @IsString()
  smtpUser?: string;

  @IsOptional()
  @IsString()
  smtpPassword?: string;

  @IsOptional()
  @IsEmail()
  smtpFrom?: string;
}

export class UpdateRolePermissionDto {
  @IsString()
  role: string;

  @IsString()
  module: string;

  @IsString()
  accessLevel: string;
}
