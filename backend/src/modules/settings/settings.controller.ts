import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateSettingsDto, UpdateIntegrationsDto, UpdateRolePermissionDto } from './dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ========== CONFIGURAÇÕES GERAIS ==========
  
  // Configurações públicas (sem autenticação necessária)
  @Get('public')
  async getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  // Configurações completas (apenas ADMIN)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getSettings() {
    return this.settingsService.getSettings();
  }

  // Atualizar configurações gerais
  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateSettings(@Body() dto: UpdateSettingsDto, @Request() req: any) {
    const result = await this.settingsService.updateSettings(dto);
    
    // Log da atividade
    await this.settingsService.logActivity({
      userId: req.user.id,
      action: 'UPDATE',
      module: 'SETTINGS',
      details: { fields: Object.keys(dto) },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return result;
  }

  // ========== INTEGRAÇÕES ==========
  
  // Atualizar integrações (chaves de API)
  @Put('integrations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateIntegrations(@Body() dto: UpdateIntegrationsDto, @Request() req: any) {
    const result = await this.settingsService.updateIntegrations(dto);
    
    // Log da atividade (sem expor valores sensíveis)
    await this.settingsService.logActivity({
      userId: req.user.id,
      action: 'UPDATE',
      module: 'INTEGRATIONS',
      details: { fields: Object.keys(dto).map(k => k.replace(/Key|Secret|Password/, '***')) },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return { message: 'Integrações atualizadas com sucesso' };
  }

  // ========== COTAÇÃO DO DÓLAR ==========
  
  @Get('dollar-rate')
  async getDollarRate() {
    return this.settingsService.getDollarRate();
  }

  @Post('dollar-rate/refresh')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async refreshDollarRate() {
    const rate = await this.settingsService.fetchDollarRate();
    return { rate, updatedAt: new Date(), source: 'api-fresh' };
  }

  // ========== PERMISSÕES ==========
  
  @Get('permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getPermissions() {
    return this.settingsService.getPermissions();
  }

  @Get('permissions/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getPermissionsByRole(@Param('role') role: string) {
    return this.settingsService.getPermissionsByRole(role as any);
  }

  @Put('permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async setPermission(@Body() dto: UpdateRolePermissionDto, @Request() req: any) {
    const result = await this.settingsService.setPermission(dto);
    
    await this.settingsService.logActivity({
      userId: req.user.id,
      action: 'UPDATE',
      module: 'PERMISSIONS',
      details: dto,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return result;
  }

  @Post('permissions/initialize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async initializePermissions(@Request() req: any) {
    const result = await this.settingsService.initializeDefaultPermissions();
    
    await this.settingsService.logActivity({
      userId: req.user.id,
      action: 'INITIALIZE',
      module: 'PERMISSIONS',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return result;
  }

  // ========== CÁLCULO DE PREÇOS ==========
  
  @Post('calculate-price')
  @UseGuards(JwtAuthGuard)
  async calculatePrice(
    @Body() params: {
      costPrice?: number;
      priceInDollar?: number;
      desiredProfit?: number;
      discountPercent?: number;
      customInstallments?: number;
    }
  ) {
    return this.settingsService.calculatePrices(params);
  }

  // ========== LOGS DE ATIVIDADE ==========
  
  @Get('activity-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getActivityLogs(
    @Query('userId') userId?: string,
    @Query('module') module?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.settingsService.getActivityLogs({
      userId,
      module,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }
}
