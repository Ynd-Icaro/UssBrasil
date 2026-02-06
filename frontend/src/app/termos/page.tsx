'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, FileText, ShoppingCart, CreditCard, Truck, RefreshCw, AlertCircle, Scale, Gavel, Mail } from 'lucide-react';

export default function TermosPage() {
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
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text">
                  Termos de Uso
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
                  Bem-vindo à <strong className="text-text">USSBRASIL</strong>! Ao acessar e utilizar nosso site, 
                  você concorda com os seguintes termos e condições. Leia atentamente antes de realizar qualquer compra.
                </p>
              </div>

              {/* 1. Informações da Empresa */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Scale className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">1. Identificação da Empresa</h2>
                </div>
                <div className="pl-9 text-text-secondary">
                  <div className="bg-surface rounded-lg p-4 space-y-2">
                    <p><strong className="text-text">Razão Social:</strong> USSBRASIL Comércio de Eletrônicos LTDA</p>
                    <p><strong className="text-text">CNPJ:</strong> XX.XXX.XXX/0001-XX</p>
                    <p><strong className="text-text">Endereço:</strong> Praça Nereu Ramos, 364 - Centro, Criciúma/SC - CEP 88801-505</p>
                    <p><strong className="text-text">E-mail:</strong> contato@ussbrasil.com.br</p>
                    <p><strong className="text-text">Telefone:</strong> (48) 3045-6044</p>
                  </div>
                </div>
              </div>

              {/* 2. Produtos */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">2. Produtos e Disponibilidade</h2>
                </div>
                <div className="pl-9 text-text-secondary space-y-3">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>As imagens são meramente ilustrativas e podem apresentar variações de cor</li>
                    <li>Especificações técnicas podem sofrer alterações sem aviso prévio pelo fabricante</li>
                    <li>A disponibilidade dos produtos está sujeita ao estoque no momento da compra</li>
                    <li>Preços podem ser alterados a qualquer momento sem aviso prévio</li>
                    <li>Promoções são válidas enquanto durarem os estoques ou até a data limite indicada</li>
                  </ul>
                </div>
              </div>

              {/* 3. Processo de Compra */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">3. Processo de Compra e Pagamento</h2>
                </div>
                <div className="pl-9 text-text-secondary space-y-3">
                  <div>
                    <h3 className="font-medium text-text mb-2">3.1 Conclusão da Compra:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>A compra só é confirmada após a aprovação do pagamento</li>
                      <li>Você receberá um e-mail de confirmação com os detalhes do pedido</li>
                      <li>Reservamo-nos o direito de cancelar pedidos suspeitos de fraude</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-2">3.2 Formas de Pagamento:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cartão de crédito (Visa, Mastercard, Elo, American Express)</li>
                      <li>PIX com desconto especial</li>
                      <li>Parcelamento em até 12x (sujeito a juros após 3x)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-2">3.3 Segurança:</h3>
                    <p>Todos os pagamentos são processados de forma segura pelo Stripe, com criptografia de ponta a ponta.</p>
                  </div>
                </div>
              </div>

              {/* 4. Entrega */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">4. Entrega e Frete</h2>
                </div>
                <div className="pl-9 text-text-secondary space-y-3">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>O prazo de entrega começa a contar após a aprovação do pagamento</li>
                    <li>Entregas são realizadas de segunda a sexta-feira, exceto feriados</li>
                    <li>O destinatário deve conferir o produto no ato da entrega</li>
                    <li>Em caso de avaria, recuse o produto e entre em contato conosco</li>
                    <li>Tentativas de entrega seguem as políticas da transportadora</li>
                    <li>Não nos responsabilizamos por atrasos causados por endereço incorreto</li>
                  </ul>
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-text font-medium">Frete Grátis</p>
                    <p className="text-sm mt-1">Para compras acima de R$ 299,00 para todo o Brasil*</p>
                    <p className="text-xs mt-2">*Consulte condições para regiões específicas</p>
                  </div>
                </div>
              </div>

              {/* 5. Troca e Devolução */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">5. Troca e Devolução</h2>
                </div>
                <div className="pl-9 text-text-secondary space-y-3">
                  <div>
                    <h3 className="font-medium text-text mb-2">5.1 Direito de Arrependimento (CDC):</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Você pode desistir da compra em até 7 dias após o recebimento</li>
                      <li>O produto deve estar lacrado, sem uso e na embalagem original</li>
                      <li>O reembolso será processado em até 10 dias úteis</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-2">5.2 Defeito ou Produto Errado:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Entre em contato em até 7 dias após o recebimento</li>
                      <li>Enviaremos instruções para devolução ou troca</li>
                      <li>Custos de envio serão por nossa conta</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-text mb-2">5.3 Garantia:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Garantia legal de 90 dias conforme o CDC</li>
                      <li>Garantia do fabricante conforme especificado no produto</li>
                      <li>A garantia não cobre mau uso, danos físicos ou modificações</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 6. Responsabilidades */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">6. Limitação de Responsabilidade</h2>
                </div>
                <div className="pl-9 text-text-secondary space-y-3">
                  <p>A USSBRASIL não se responsabiliza por:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Danos indiretos decorrentes do uso dos produtos</li>
                    <li>Incompatibilidade com outros dispositivos do usuário</li>
                    <li>Interrupções ou erros temporários no site</li>
                    <li>Informações incorretas fornecidas pelo cliente</li>
                    <li>Uso indevido dos produtos adquiridos</li>
                  </ul>
                </div>
              </div>

              {/* 7. Propriedade Intelectual */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Gavel className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">7. Propriedade Intelectual</h2>
                </div>
                <div className="pl-9 text-text-secondary">
                  <p>
                    Todo o conteúdo do site (textos, imagens, logotipos, layouts) é de propriedade da USSBRASIL 
                    ou licenciado para uso. É proibida a reprodução, distribuição ou modificação sem autorização prévia por escrito.
                  </p>
                </div>
              </div>

              {/* 8. Disposições Gerais */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Scale className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">8. Disposições Gerais</h2>
                </div>
                <div className="pl-9 text-text-secondary space-y-3">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Estes termos são regidos pelas leis brasileiras</li>
                    <li>Eventuais disputas serão resolvidas no foro de Criciúma/SC</li>
                    <li>A nulidade de qualquer cláusula não afeta as demais</li>
                    <li>Reservamo-nos o direito de alterar estes termos a qualquer momento</li>
                    <li>O uso continuado do site implica aceitação dos termos atualizados</li>
                  </ul>
                </div>
              </div>

              {/* 9. Contato */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-text">9. Contato</h2>
                </div>
                <div className="pl-9 text-text-secondary">
                  <p className="mb-3">
                    Para dúvidas sobre estes termos ou qualquer assunto relacionado:
                  </p>
                  <div className="bg-surface rounded-lg p-4 space-y-2">
                    <p><strong className="text-text">E-mail:</strong> contato@ussbrasil.com.br</p>
                    <p><strong className="text-text">Telefone:</strong> (48) 3045-6044</p>
                    <p><strong className="text-text">WhatsApp:</strong> (48) 99196-9371</p>
                    <p><strong className="text-text">Horário:</strong> Seg-Sex 9h às 18h | Sáb 9h às 13h</p>
                  </div>
                </div>
              </div>

              {/* Links Relacionados */}
              <div className="pt-6 border-t border-border">
                <p className="text-text-secondary text-sm mb-4">Veja também:</p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/privacidade"
                    className="text-primary hover:underline text-sm"
                  >
                    Política de Privacidade
                  </Link>
                  <Link 
                    href="/trocas"
                    className="text-primary hover:underline text-sm"
                  >
                    Política de Trocas
                  </Link>
                  <Link 
                    href="/entregas"
                    className="text-primary hover:underline text-sm"
                  >
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
