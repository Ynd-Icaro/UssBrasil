'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle, Clock, Package, Shield, HelpCircle } from 'lucide-react';

export default function TrocasPage() {
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
                <RefreshCw className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text">
                  Trocas e Devoluções
                </h1>
                <p className="text-text-secondary">Política de troca, devolução e garantia</p>
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
              {/* Direito de Arrependimento */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  Direito de Arrependimento (7 dias)
                </h2>
                <div className="text-text-secondary space-y-3">
                  <p>
                    Conforme o <strong className="text-text">Código de Defesa do Consumidor (Art. 49)</strong>, 
                    você pode desistir da compra em até 7 dias corridos após o recebimento do produto, 
                    sem necessidade de justificativa.
                  </p>
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-medium text-text mb-2">Condições:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Produto deve estar <strong className="text-text">lacrado e sem uso</strong></li>
                      <li>Embalagem original intacta, com todos os acessórios</li>
                      <li>Nota fiscal e comprovante de compra</li>
                      <li>Sem sinais de uso, danos ou avarias</li>
                    </ul>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-success/5 border border-success/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <p className="text-sm">
                      O reembolso será processado em até <strong className="text-text">10 dias úteis</strong> após 
                      recebermos e conferirmos o produto, na mesma forma de pagamento utilizada na compra.
                    </p>
                  </div>
                </div>
              </div>

              {/* Produto com Defeito */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-primary" />
                  Produto com Defeito
                </h2>
                <div className="text-text-secondary space-y-3">
                  <p>
                    Se o produto apresentar defeito de fabricação, você tem direito à troca ou reembolso:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-surface rounded-lg p-4">
                      <h3 className="font-medium text-text mb-2">Até 7 dias do recebimento</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Troca imediata por outro igual</li>
                        <li>• Reembolso integral</li>
                        <li>• Frete por nossa conta</li>
                      </ul>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <h3 className="font-medium text-text mb-2">De 7 a 90 dias (Garantia Legal)</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Reparo em até 30 dias</li>
                        <li>• Troca se reparo não resolver</li>
                        <li>• Reembolso como última opção</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Produto Errado */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />
                  Produto Errado ou Diferente
                </h2>
                <div className="text-text-secondary space-y-3">
                  <p>
                    Se você recebeu um produto diferente do que comprou:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Entre em contato em até <strong className="text-text">7 dias</strong> após o recebimento</li>
                    <li>Envie fotos do produto recebido e da embalagem</li>
                    <li>Aguarde instruções para devolução (frete por nossa conta)</li>
                    <li>Reenviaremos o produto correto ou efetuaremos o reembolso</li>
                  </ul>
                </div>
              </div>

              {/* Garantia */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Garantia
                </h2>
                <div className="text-text-secondary space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-surface rounded-lg p-4">
                      <h3 className="font-medium text-text mb-2">Garantia Legal</h3>
                      <ul className="text-sm space-y-1">
                        <li>• 90 dias para produtos duráveis</li>
                        <li>• Obrigatória por lei (CDC)</li>
                        <li>• Cobre defeitos de fabricação</li>
                      </ul>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <h3 className="font-medium text-text mb-2">Garantia do Fabricante</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Varia conforme o produto</li>
                        <li>• Geralmente 12 meses</li>
                        <li>• Consulte o manual do produto</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-error/5 border border-error/20 rounded-lg p-4 mt-4">
                    <h3 className="font-medium text-text mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-error" />
                      A garantia NÃO cobre:
                    </h3>
                    <ul className="text-sm space-y-1">
                      <li>• Danos causados por mau uso ou quedas</li>
                      <li>• Danos por líquidos ou umidade</li>
                      <li>• Modificações ou reparos não autorizados</li>
                      <li>• Desgaste natural de uso</li>
                      <li>• Danos por variação de energia elétrica</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Como Solicitar */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-primary" />
                  Como Solicitar Troca ou Devolução
                </h2>
                <div className="text-text-secondary">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-text">Entre em contato conosco</strong>
                      <p className="text-sm mt-1">Via WhatsApp, e-mail ou telefone com seu número de pedido</p>
                    </li>
                    <li>
                      <strong className="text-text">Informe o motivo</strong>
                      <p className="text-sm mt-1">Descreva o problema ou motivo da solicitação</p>
                    </li>
                    <li>
                      <strong className="text-text">Envie fotos (se aplicável)</strong>
                      <p className="text-sm mt-1">Para defeitos ou produtos diferentes, anexe fotos</p>
                    </li>
                    <li>
                      <strong className="text-text">Aguarde análise</strong>
                      <p className="text-sm mt-1">Responderemos em até 2 dias úteis com instruções</p>
                    </li>
                    <li>
                      <strong className="text-text">Envie o produto</strong>
                      <p className="text-sm mt-1">Siga as instruções de postagem que enviaremos</p>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-surface rounded-xl p-6">
                <h3 className="font-semibold text-text mb-4">Canais de Atendimento para Trocas e Devoluções</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-text-secondary">
                  <div>
                    <p className="font-medium text-text">WhatsApp</p>
                    <p>(48) 99196-9371</p>
                  </div>
                  <div>
                    <p className="font-medium text-text">E-mail</p>
                    <p>trocas@ussbrasil.com.br</p>
                  </div>
                  <div>
                    <p className="font-medium text-text">Horário</p>
                    <p>Seg-Sex: 9h às 18h</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="pt-6 border-t border-border">
                <p className="text-text-secondary text-sm mb-4">Veja também:</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/termos" className="text-primary hover:underline text-sm">
                    Termos de Uso
                  </Link>
                  <Link href="/privacidade" className="text-primary hover:underline text-sm">
                    Política de Privacidade
                  </Link>
                  <Link href="/entregas" className="text-primary hover:underline text-sm">
                    Política de Entregas
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
