'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, DollarSign, CreditCard, Building2, Users, Shield, 
  RefreshCw, Save, Eye, EyeOff, CheckCircle, AlertCircle, 
  Percent, Lock, Mail, Cloud, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface SystemSettings {
  companyName: string;
  companyDocument: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  taxRate: number;
  stripeRate: number;
  stripeFixedFee: number;
  defaultProfitMargin: number;
  useDollarRate: boolean;
  manualDollarRate: number | null;
  dollarSpread: number;
  defaultMaxInstallments: number;
  maxInstallmentsNoFee: number;
  minInstallmentValue: number;
  lastDollarRate: number | null;
  lastDollarRateAt: string | null;
  hasStripeConfig: boolean;
  hasCloudinaryConfig: boolean;
  hasSmtpConfig: boolean;
  stripePublicKey: string | null;
  cloudinaryCloudName: string | null;
  cloudinaryApiKey: string | null;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpFrom: string | null;
}

interface RolePermission {
  id: string;
  role: string;
  module: string;
  accessLevel: string;
}

const tabs = [
  { id: 'company', label: 'Empresa', icon: Building2 },
  { id: 'pricing', label: 'Preços', icon: DollarSign },
  { id: 'installments', label: 'Parcelamento', icon: CreditCard },
  { id: 'permissions', label: 'Permissões', icon: Shield },
  { id: 'integrations', label: 'Integrações', icon: Cloud },
  { id: 'activity', label: 'Atividades', icon: Activity },
];

const modules = [
  { id: 'DASHBOARD', label: 'Dashboard' },
  { id: 'PRODUCTS', label: 'Produtos' },
  { id: 'CATEGORIES', label: 'Categorias' },
  { id: 'BRANDS', label: 'Marcas' },
  { id: 'ORDERS', label: 'Pedidos' },
  { id: 'CUSTOMERS', label: 'Clientes' },
  { id: 'REVIEWS', label: 'Avaliações' },
  { id: 'REPORTS', label: 'Relatórios' },
  { id: 'SETTINGS', label: 'Configurações' },
  { id: 'INTEGRATIONS', label: 'Integrações' },
  { id: 'USERS', label: 'Usuários' },
];

const accessLevels = [
  { value: 'NONE', label: 'Sem Acesso', color: 'text-gray-400' },
  { value: 'VIEW', label: 'Visualizar', color: 'text-blue-500' },
  { value: 'EDIT', label: 'Editar', color: 'text-yellow-500' },
  { value: 'FULL', label: 'Completo', color: 'text-green-500' },
];

const roles = ['GERENTE', 'VENDEDOR'];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    companyDocument: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
  });

  const [pricingForm, setPricingForm] = useState({
    taxRate: 15,
    stripeRate: 3.99,
    stripeFixedFee: 0.39,
    defaultProfitMargin: 30,
    useDollarRate: true,
    manualDollarRate: 5.0,
    dollarSpread: 0,
  });

  const [installmentsForm, setInstallmentsForm] = useState({
    defaultMaxInstallments: 12,
    maxInstallmentsNoFee: 3,
    minInstallmentValue: 50,
  });

  const [integrationsForm, setIntegrationsForm] = useState({
    stripeSecretKey: '',
    stripePublicKey: '',
    stripeWebhookSecret: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, permissionsRes, activitiesRes] = await Promise.all([
        api.get('/settings'),
        api.get('/settings/permissions'),
        api.get('/settings/activity-logs?limit=50'),
      ]);

      const s = settingsRes.data;
      setSettings(s);

      // Populate forms
      setCompanyForm({
        companyName: s.companyName || '',
        companyDocument: s.companyDocument || '',
        companyEmail: s.companyEmail || '',
        companyPhone: s.companyPhone || '',
        companyAddress: s.companyAddress || '',
      });

      setPricingForm({
        taxRate: Number(s.taxRate) || 15,
        stripeRate: Number(s.stripeRate) || 3.99,
        stripeFixedFee: Number(s.stripeFixedFee) || 0.39,
        defaultProfitMargin: Number(s.defaultProfitMargin) || 30,
        useDollarRate: s.useDollarRate ?? true,
        manualDollarRate: Number(s.manualDollarRate) || 5.0,
        dollarSpread: Number(s.dollarSpread) || 0,
      });

      setInstallmentsForm({
        defaultMaxInstallments: s.defaultMaxInstallments || 12,
        maxInstallmentsNoFee: s.maxInstallmentsNoFee || 3,
        minInstallmentValue: Number(s.minInstallmentValue) || 50,
      });

      setIntegrationsForm(prev => ({
        ...prev,
        stripePublicKey: s.stripePublicKey || '',
        cloudinaryCloudName: s.cloudinaryCloudName || '',
        cloudinaryApiKey: s.cloudinaryApiKey || '',
        smtpHost: s.smtpHost || '',
        smtpPort: s.smtpPort || 587,
        smtpUser: s.smtpUser || '',
        smtpFrom: s.smtpFrom || '',
      }));

      setPermissions(permissionsRes.data || []);
      setActivities(activitiesRes.data?.data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDollarRate = async () => {
    try {
      await api.post('/settings/dollar-rate/refresh');
      loadData();
      showSuccess('Cotação do dólar atualizada!');
    } catch (error) {
      console.error('Error refreshing dollar rate:', error);
    }
  };

  const initializePermissions = async () => {
    try {
      await api.post('/settings/permissions/initialize');
      loadData();
      showSuccess('Permissões padrão inicializadas!');
    } catch (error) {
      console.error('Error initializing permissions:', error);
    }
  };

  const saveSettings = async (data: any) => {
    setIsSaving(true);
    try {
      await api.put('/settings', data);
      showSuccess('Configurações salvas com sucesso!');
      loadData();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveIntegrations = async () => {
    setIsSaving(true);
    try {
      // Filtrar campos vazios e placeholders
      const data: any = {};
      Object.entries(integrationsForm).forEach(([key, value]) => {
        if (value && value !== '••••••••') {
          data[key] = value;
        }
      });
      
      await api.put('/settings/integrations', data);
      showSuccess('Integrações atualizadas com sucesso!');
      loadData();
    } catch (error) {
      console.error('Error saving integrations:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePermission = async (role: string, module: string, accessLevel: string) => {
    try {
      await api.put('/settings/permissions', { role, module, accessLevel });
      loadData();
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const getPermission = (role: string, module: string) => {
    return permissions.find(p => p.role === role && p.module === module)?.accessLevel || 'NONE';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Configurações</h1>
          <p className="text-text-secondary mt-1">Gerencie as configurações do sistema</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-border p-6">
        {/* Empresa */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Informações da Empresa
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <input
                  type="text"
                  value={companyForm.companyName}
                  onChange={(e) => setCompanyForm(f => ({ ...f, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CNPJ</label>
                <input
                  type="text"
                  value={companyForm.companyDocument}
                  onChange={(e) => setCompanyForm(f => ({ ...f, companyDocument: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <input
                  type="email"
                  value={companyForm.companyEmail}
                  onChange={(e) => setCompanyForm(f => ({ ...f, companyEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <input
                  type="text"
                  value={companyForm.companyPhone}
                  onChange={(e) => setCompanyForm(f => ({ ...f, companyPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Endereço</label>
                <input
                  type="text"
                  value={companyForm.companyAddress}
                  onChange={(e) => setCompanyForm(f => ({ ...f, companyAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => saveSettings(companyForm)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        )}

        {/* Preços */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Configurações de Preço
            </h2>

            {/* Cotação do Dólar */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Cotação do Dólar</span>
                </div>
                <Button onClick={refreshDollarRate} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Atualizar
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-text-secondary">Atual</span>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {settings?.lastDollarRate?.toFixed(4) || '—'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">Atualizado em</span>
                  <div className="font-medium">
                    {settings?.lastDollarRateAt 
                      ? new Date(settings.lastDollarRateAt).toLocaleString('pt-BR')
                      : '—'
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Taxa de Impostos (%)
                </label>
                <input
                  type="number"
                  value={pricingForm.taxRate}
                  onChange={(e) => setPricingForm(f => ({ ...f, taxRate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  step="0.01"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-text-tertiary">Taxa aplicada sobre o preço de venda</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Taxa Stripe (%)</label>
                <input
                  type="number"
                  value={pricingForm.stripeRate}
                  onChange={(e) => setPricingForm(f => ({ ...f, stripeRate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Taxa Fixa Stripe (R$)</label>
                <input
                  type="number"
                  value={pricingForm.stripeFixedFee}
                  onChange={(e) => setPricingForm(f => ({ ...f, stripeFixedFee: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Margem de Lucro Padrão (%)</label>
                <input
                  type="number"
                  value={pricingForm.defaultProfitMargin}
                  onChange={(e) => setPricingForm(f => ({ ...f, defaultProfitMargin: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  min="0"
                  max="200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Spread do Dólar (%)</label>
                <input
                  type="number"
                  value={pricingForm.dollarSpread}
                  onChange={(e) => setPricingForm(f => ({ ...f, dollarSpread: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-text-tertiary">Adicional sobre a cotação do dólar</p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pricingForm.useDollarRate}
                    onChange={(e) => setPricingForm(f => ({ ...f, useDollarRate: e.target.checked }))}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium">Usar cotação automática</span>
                </label>
                {!pricingForm.useDollarRate && (
                  <input
                    type="number"
                    value={pricingForm.manualDollarRate || ''}
                    onChange={(e) => setPricingForm(f => ({ ...f, manualDollarRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg mt-2"
                    placeholder="Cotação manual"
                    step="0.0001"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => saveSettings(pricingForm)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        )}

        {/* Parcelamento */}
        {activeTab === 'installments' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Configurações de Parcelamento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Máximo de Parcelas</label>
                <input
                  type="number"
                  value={installmentsForm.defaultMaxInstallments}
                  onChange={(e) => setInstallmentsForm(f => ({ ...f, defaultMaxInstallments: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  min="1"
                  max="24"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Parcelas sem Juros</label>
                <input
                  type="number"
                  value={installmentsForm.maxInstallmentsNoFee}
                  onChange={(e) => setInstallmentsForm(f => ({ ...f, maxInstallmentsNoFee: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  min="1"
                  max={installmentsForm.defaultMaxInstallments}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Valor Mínimo da Parcela (R$)</label>
                <input
                  type="number"
                  value={installmentsForm.minInstallmentValue}
                  onChange={(e) => setInstallmentsForm(f => ({ ...f, minInstallmentValue: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              <strong>Dica:</strong> Você também pode configurar parcelamento específico por produto na página de edição do produto.
            </div>

            <div className="flex justify-end">
              <Button onClick={() => saveSettings(installmentsForm)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        )}

        {/* Permissões */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Permissões por Função
              </h2>
              <Button onClick={initializePermissions} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Restaurar Padrão
              </Button>
            </div>

            <div className="text-sm text-text-secondary">
              <p><strong>ADMIN:</strong> Acesso total a todos os módulos (não editável)</p>
              <p><strong>GERENTE:</strong> Configure abaixo o acesso por módulo</p>
              <p><strong>VENDEDOR:</strong> Configure abaixo o acesso por módulo</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Módulo</th>
                    {roles.map(role => (
                      <th key={role} className="text-center py-3 px-4 font-medium">{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modules.map(module => (
                    <tr key={module.id} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 px-4">{module.label}</td>
                      {roles.map(role => (
                        <td key={`${role}-${module.id}`} className="text-center py-3 px-4">
                          <select
                            value={getPermission(role, module.id)}
                            onChange={(e) => updatePermission(role, module.id, e.target.value)}
                            className={cn(
                              "px-2 py-1 rounded border text-xs font-medium",
                              accessLevels.find(a => a.value === getPermission(role, module.id))?.color
                            )}
                          >
                            {accessLevels.map(level => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Integrações */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              Integrações
            </h2>

            {/* Status das integrações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={cn(
                "p-4 rounded-lg border",
                settings?.hasStripeConfig ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {settings?.hasStripeConfig ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium">Stripe</span>
                </div>
                <p className="text-sm text-text-secondary">
                  {settings?.hasStripeConfig ? 'Configurado' : 'Não configurado'}
                </p>
              </div>

              <div className={cn(
                "p-4 rounded-lg border",
                settings?.hasCloudinaryConfig ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {settings?.hasCloudinaryConfig ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium">Cloudinary</span>
                </div>
                <p className="text-sm text-text-secondary">
                  {settings?.hasCloudinaryConfig ? 'Configurado' : 'Não configurado'}
                </p>
              </div>

              <div className={cn(
                "p-4 rounded-lg border",
                settings?.hasSmtpConfig ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {settings?.hasSmtpConfig ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium">E-mail (SMTP)</span>
                </div>
                <p className="text-sm text-text-secondary">
                  {settings?.hasSmtpConfig ? 'Configurado' : 'Não configurado'}
                </p>
              </div>
            </div>

            {/* Stripe */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Stripe
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chave Pública</label>
                  <input
                    type="text"
                    value={integrationsForm.stripePublicKey}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, stripePublicKey: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg font-mono text-sm"
                    placeholder="pk_..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    Chave Secreta
                    <button
                      onClick={() => setShowSecrets(s => ({ ...s, stripe: !s.stripe }))}
                      className="text-text-secondary hover:text-primary"
                    >
                      {showSecrets.stripe ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </label>
                  <input
                    type={showSecrets.stripe ? 'text' : 'password'}
                    value={integrationsForm.stripeSecretKey}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, stripeSecretKey: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg font-mono text-sm"
                    placeholder="sk_..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Webhook Secret</label>
                  <input
                    type={showSecrets.stripe ? 'text' : 'password'}
                    value={integrationsForm.stripeWebhookSecret}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, stripeWebhookSecret: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg font-mono text-sm"
                    placeholder="whsec_..."
                  />
                </div>
              </div>
            </div>

            {/* Cloudinary */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Cloudinary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cloud Name</label>
                  <input
                    type="text"
                    value={integrationsForm.cloudinaryCloudName}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, cloudinaryCloudName: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <input
                    type="text"
                    value={integrationsForm.cloudinaryApiKey}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, cloudinaryApiKey: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Secret</label>
                  <input
                    type={showSecrets.cloudinary ? 'text' : 'password'}
                    value={integrationsForm.cloudinaryApiSecret}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, cloudinaryApiSecret: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* SMTP */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail (SMTP)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Host</label>
                  <input
                    type="text"
                    value={integrationsForm.smtpHost}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, smtpHost: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="smtp.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Porta</label>
                  <input
                    type="number"
                    value={integrationsForm.smtpPort}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, smtpPort: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Usuário</label>
                  <input
                    type="text"
                    value={integrationsForm.smtpUser}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, smtpUser: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <input
                    type="password"
                    value={integrationsForm.smtpPassword}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, smtpPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">E-mail de Origem</label>
                  <input
                    type="email"
                    value={integrationsForm.smtpFrom}
                    onChange={(e) => setIntegrationsForm(f => ({ ...f, smtpFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                    placeholder="noreply@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-yellow-800">Segurança:</strong>
                  <p className="text-yellow-700 mt-1">
                    As chaves secretas são criptografadas antes de serem armazenadas no banco de dados.
                    Apenas o sistema tem acesso aos valores reais.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={saveIntegrations} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Integrações'}
              </Button>
            </div>
          </div>
        )}

        {/* Atividades */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Log de Atividades
            </h2>

            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma atividade registrada</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      activity.action === 'UPDATE' && "bg-blue-100 text-blue-600",
                      activity.action === 'CREATE' && "bg-green-100 text-green-600",
                      activity.action === 'DELETE' && "bg-red-100 text-red-600",
                      activity.action === 'LOGIN' && "bg-purple-100 text-purple-600"
                    )}>
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {activity.user?.firstName} {activity.user?.lastName}
                        </span>
                        <span className="text-xs text-text-tertiary">
                          {new Date(activity.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">
                        <span className="font-medium">{activity.action}</span> em{' '}
                        <span className="font-medium">{activity.module}</span>
                        {activity.entityType && (
                          <span className="text-text-tertiary ml-1">
                            ({activity.entityType})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
