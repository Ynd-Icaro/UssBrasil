'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Truck, Clock, MapPin, Package, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

export default function EntregasPage() {
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
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text">
                  Política de Entregas
                </h1>
                <p className="text-text-secondary">Como funciona o envio dos seus pedidos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Frete Grátis Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-8 mb-8 text-center"
            >
              <Truck className="w-12 h-12 text-black mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-black mb-2">Frete Grátis</h2>
              <p className="text-black/80 text-lg">
                Em compras acima de <strong>R$ 299,00</strong> para todo o Brasil*
              </p>
              <p className="text-black/60 text-sm mt-2">
                *Via PAC ou retirada em loja. Algumas regiões podem ter condições específicas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border p-8 md:p-12 shadow-card space-y-8"
            >
              {/* Modalidades */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />
                  Modalidades de Envio
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-surface rounded-xl p-5">
                    <h3 className="font-semibold text-text mb-2">PAC - Correios</h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Prazo: 3-15 dias úteis</li>
                      <li>• Econômico</li>
                      <li>• Rastreamento incluso</li>
                      <li>• Elegível para frete grátis</li>
                    </ul>
                  </div>
                  <div className="bg-surface rounded-xl p-5">
                    <h3 className="font-semibold text-text mb-2">SEDEX - Correios</h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Prazo: 1-8 dias úteis</li>
                      <li>• Envio expresso</li>
                      <li>• Rastreamento incluso</li>
                      <li>• Não incluso no frete grátis</li>
                    </ul>
                  </div>
                  <div className="bg-surface rounded-xl p-5">
                    <h3 className="font-semibold text-text mb-2">Transportadora</h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Prazo: 5-18 dias úteis</li>
                      <li>• Ideal para volumes maiores</li>
                      <li>• Rastreamento disponível</li>
                      <li>• Elegível para frete grátis</li>
                    </ul>
                  </div>
                  <div className="bg-surface rounded-xl p-5">
                    <h3 className="font-semibold text-text mb-2">Retirar na Loja</h3>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Disponível em 1 dia útil</li>
                      <li>• Gratuito</li>
                      <li>• Apenas Criciúma e região</li>
                      <li>• Documento com foto</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Prazos */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  Prazos de Entrega
                </h2>
                <div className="text-text-secondary space-y-3">
                  <p>
                    O prazo de entrega começa a contar a partir da <strong className="text-text">aprovação do pagamento</strong>:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-text">Cartão de crédito:</strong> Aprovação em até 2 horas</li>
                    <li><strong className="text-text">PIX:</strong> Aprovação imediata</li>
                    <li><strong className="text-text">Boleto:</strong> Aprovação em até 3 dias úteis</li>
                  </ul>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                    <p className="text-sm">
                      <strong className="text-text">Importante:</strong> Pedidos aprovados até às 14h em dias úteis 
                      são despachados no mesmo dia. Após esse horário, o envio ocorre no próximo dia útil.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rastreamento */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  Rastreamento
                </h2>
                <div className="text-text-secondary space-y-3">
                  <p>
                    Assim que seu pedido for despachado, você receberá por e-mail o código de rastreamento. 
                    Você também pode acompanhar o status diretamente na sua conta em <strong className="text-text">Meus Pedidos</strong>.
                  </p>
                  <div className="flex items-start gap-3 p-4 bg-surface rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <p className="text-sm">
                      O rastreamento fica disponível em até 24h após o despacho da mercadoria.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recebimento */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />
                  No Recebimento
                </h2>
                <div className="text-text-secondary space-y-3">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Confira se a embalagem está lacrada e sem avarias</li>
                    <li>Verifique se os dados da etiqueta conferem com seu pedido</li>
                    <li>Em caso de avaria externa, <strong className="text-text">recuse o produto</strong> e entre em contato</li>
                    <li>Após o recebimento, você tem <strong className="text-text">7 dias</strong> para reportar problemas</li>
                  </ul>
                </div>
              </div>

              {/* Tentativas de Entrega */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-primary" />
                  Tentativas de Entrega
                </h2>
                <div className="text-text-secondary space-y-3">
                  <p>
                    Os Correios realizam até <strong className="text-text">3 tentativas de entrega</strong>. 
                    Se não houver ninguém para receber:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Um aviso será deixado com informações para retirada na agência</li>
                    <li>O prazo para retirada é de <strong className="text-text">7 dias</strong></li>
                    <li>Após esse prazo, o pedido retorna para nossa loja</li>
                    <li>Novos envios podem gerar custos adicionais de frete</li>
                  </ul>
                </div>
              </div>

              {/* FAQ */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-text flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-primary" />
                  Dúvidas Frequentes
                </h2>
                <div className="space-y-4">
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-medium text-text mb-2">Posso alterar o endereço após a compra?</h3>
                    <p className="text-sm text-text-secondary">
                      Sim, desde que o pedido ainda não tenha sido despachado. Entre em contato conosco o mais rápido possível.
                    </p>
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-medium text-text mb-2">Vocês entregam em todo o Brasil?</h3>
                    <p className="text-sm text-text-secondary">
                      Sim! Entregamos em todas as regiões do Brasil através dos Correios ou transportadoras parceiras.
                    </p>
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-medium text-text mb-2">E se meu pedido atrasar?</h3>
                    <p className="text-sm text-text-secondary">
                      Entre em contato conosco informando o número do pedido. Iremos verificar com a transportadora e mantê-lo informado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="pt-6 border-t border-border">
                <p className="text-text-secondary text-sm mb-4">Veja também:</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/trocas" className="text-primary hover:underline text-sm">
                    Política de Trocas e Devoluções
                  </Link>
                  <Link href="/termos" className="text-primary hover:underline text-sm">
                    Termos de Uso
                  </Link>
                  <Link href="/contato" className="text-primary hover:underline text-sm">
                    Fale Conosco
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
