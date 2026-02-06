'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Lock, FileText, Users, Scale, AlertTriangle, Mail } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text">
                  Política de Privacidade
                </h1>
                <p className="text-text-secondary">Última atualização: Janeiro de 2025</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border p-8 md:p-12 shadow-card space-y-8"
            >
              {/* Introdução */}
              <div>
                <p className="text-text-secondary leading-relaxed">
                  A <strong className="text-text">USSBRASIL</strong> está comprometida em proteger sua privacidade. 
                  Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações 
                  quando você visita nosso site ou utiliza nossos serviços, em conformidade com a Lei Geral de Proteção 
                  de Dados (LGPD - Lei nº 13.709/2018).
                </p>
              </div>

              {/* 1. Dados Coletados */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">1. Dados que Coletamos</h2>
                </div>
                <div className="pl-9 space-y-4 text-text-secondary">
                  <div>
                    <h3 className="font-medium text-text mb-2">1.1 Dados fornecidos por você:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Nome completo e CPF</li>
                      <li>Endereço de e-mail e telefone</li>
                      <li>Endereço de entrega</li>
                      <li>Dados de pagamento (processados de forma segura via Stripe)</li>
                      <li>Informações de conta e preferências</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-2">1.2 Dados coletados automaticamente:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Endereço IP e localização aproximada</li>
                      <li>Tipo de navegador e dispositivo</li>
                      <li>Páginas visitadas e tempo de navegação</li>
                      <li>Cookies e tecnologias similares</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Uso dos Dados */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">2. Como Usamos seus Dados</h2>
                </div>
                <div className="pl-9">
                  <ul className="list-disc pl-5 space-y-2 text-text-secondary">
                    <li>Processar e entregar seus pedidos</li>
                    <li>Comunicar sobre status de pedidos e promoções</li>
                    <li>Melhorar nossos produtos e serviços</li>
                    <li>Prevenir fraudes e garantir a segurança</li>
                    <li>Cumprir obrigações legais e fiscais</li>
                    <li>Personalizar sua experiência de compra</li>
                  </ul>
                </div>
              </div>

              {/* 3. Compartilhamento */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">3. Compartilhamento de Dados</h2>
                </div>
                <div className="pl-9 text-text-secondary space-y-3">
                  <p>Podemos compartilhar seus dados com:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-text">Transportadoras:</strong> Para entrega de produtos</li>
                    <li><strong className="text-text">Processadores de pagamento:</strong> Stripe para transações seguras</li>
                    <li><strong className="text-text">Autoridades:</strong> Quando exigido por lei</li>
                    <li><strong className="text-text">Prestadores de serviço:</strong> Que nos auxiliam nas operações</li>
                  </ul>
                  <p className="mt-4 p-4 bg-surface rounded-lg">
                    <strong className="text-text">Importante:</strong> Nunca vendemos seus dados pessoais a terceiros.
                  </p>
                </div>
              </div>

              {/* 4. Segurança */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">4. Segurança dos Dados</h2>
                </div>
                <div className="pl-9 text-text-secondary">
                  <p className="mb-3">Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Criptografia SSL/TLS em todas as páginas</li>
                    <li>Armazenamento seguro com acesso restrito</li>
                    <li>Monitoramento contínuo de segurança</li>
                    <li>Backups regulares e plano de recuperação</li>
                    <li>Treinamento da equipe em proteção de dados</li>
                  </ul>
                </div>
              </div>

              {/* 5. Seus Direitos */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Scale className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">5. Seus Direitos (LGPD)</h2>
                </div>
                <div className="pl-9 text-text-secondary">
                  <p className="mb-3">Conforme a LGPD, você tem direito a:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-text">Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                    <li><strong className="text-text">Correção:</strong> Corrigir dados incompletos ou desatualizados</li>
                    <li><strong className="text-text">Anonimização ou exclusão:</strong> Quando os dados forem desnecessários</li>
                    <li><strong className="text-text">Portabilidade:</strong> Transferir seus dados para outro serviço</li>
                    <li><strong className="text-text">Revogação do consentimento:</strong> A qualquer momento</li>
                    <li><strong className="text-text">Oposição:</strong> Ao tratamento quando não houver consentimento</li>
                  </ul>
                </div>
              </div>

              {/* 6. Cookies */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">6. Cookies</h2>
                </div>
                <div className="pl-9 text-text-secondary">
                  <p className="mb-3">Utilizamos cookies para:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-text">Essenciais:</strong> Funcionamento do site e carrinho de compras</li>
                    <li><strong className="text-text">Analíticos:</strong> Entender como você usa o site</li>
                    <li><strong className="text-text">Marketing:</strong> Personalizar anúncios e ofertas</li>
                  </ul>
                  <p className="mt-3">
                    Você pode gerenciar cookies nas configurações do seu navegador.
                  </p>
                </div>
              </div>

              {/* 7. Retenção */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">7. Retenção de Dados</h2>
                </div>
                <div className="pl-9 text-text-secondary">
                  <p>
                    Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas, 
                    incluindo obrigações legais (5 anos para dados fiscais). Após esse período, 
                    os dados são excluídos ou anonimizados.
                  </p>
                </div>
              </div>

              {/* 8. Contato */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">8. Contato</h2>
                </div>
                <div className="pl-9 text-text-secondary">
                  <p className="mb-3">
                    Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                  </p>
                  <div className="bg-surface rounded-lg p-4 space-y-2">
                    <p><strong className="text-text">E-mail:</strong> privacidade@ussbrasil.com.br</p>
                    <p><strong className="text-text">Telefone:</strong> (48) 3045-6044</p>
                    <p><strong className="text-text">Endereço:</strong> Praça Nereu Ramos, 364 - Centro, Criciúma/SC</p>
                  </div>
                </div>
              </div>

              {/* 9. Alterações */}
              <div className="space-y-4 pt-6 border-t border-border">
                <p className="text-text-secondary text-sm">
                  Esta política pode ser atualizada periodicamente. Recomendamos que você a revise regularmente. 
                  Alterações significativas serão comunicadas por e-mail ou aviso no site.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
