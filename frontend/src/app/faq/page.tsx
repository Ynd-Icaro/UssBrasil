'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ChevronDown, 
  Search, 
  HelpCircle,
  ShoppingCart,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  Store,
  MessageCircle,
  Phone
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'pedidos',
    title: 'Pedidos e Compras',
    icon: ShoppingCart,
    color: 'text-blue-500 bg-blue-500/10',
    items: [
      {
        question: 'Como faço uma compra no site?',
        answer: 'Navegue pelos produtos, adicione ao carrinho, calcule o frete com seu CEP, faça login ou cadastre-se, escolha a forma de pagamento e finalize. Você receberá um e-mail de confirmação imediatamente.',
      },
      {
        question: 'Posso alterar meu pedido após a confirmação?',
        answer: 'Alterações são possíveis apenas antes do envio. Entre em contato imediatamente pelo WhatsApp (48) 99196-9371 ou e-mail contato@ussbrasil.com.br informando o número do pedido.',
      },
      {
        question: 'Como acompanho meu pedido?',
        answer: 'Após o envio, você receberá um código de rastreio por e-mail. Também pode acompanhar em tempo real na área "Meus Pedidos" do site fazendo login na sua conta.',
      },
      {
        question: 'Posso cancelar meu pedido?',
        answer: 'O cancelamento é possível antes do envio. Se o pagamento foi feito por PIX ou cartão, o estorno será feito em até 7 dias úteis. Para boleto não compensado, o cancelamento é automático.',
      },
      {
        question: 'Vocês emitem nota fiscal?',
        answer: 'Sim! Todos os produtos são vendidos com nota fiscal eletrônica (NF-e), enviada automaticamente por e-mail após a aprovação do pagamento.',
      },
    ],
  },
  {
    id: 'pagamentos',
    title: 'Pagamentos',
    icon: CreditCard,
    color: 'text-green-500 bg-green-500/10',
    items: [
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos cartão de crédito (Visa, Mastercard, Elo, Amex) em até 12x sem juros, PIX com 5% de desconto e boleto bancário.',
      },
      {
        question: 'O pagamento é seguro?',
        answer: 'Absolutamente! Utilizamos criptografia SSL 256-bit e processamos pagamentos via Stripe, líder mundial em segurança de pagamentos. Seus dados nunca são armazenados em nossos servidores.',
      },
      {
        question: 'Quando meu cartão será cobrado?',
        answer: 'A cobrança é feita no momento da aprovação do pedido. Para compras parceladas, cada parcela será cobrada na data de vencimento da sua fatura.',
      },
      {
        question: 'O PIX é aprovado na hora?',
        answer: 'Sim! O PIX é aprovado instantaneamente, 24 horas por dia, 7 dias por semana. Após a confirmação, seu pedido já entra em separação.',
      },
      {
        question: 'Qual o prazo do boleto?',
        answer: 'O boleto tem vencimento de 3 dias úteis. Após o pagamento, a compensação pode levar de 1 a 2 dias úteis. Se não for pago, o pedido é cancelado automaticamente.',
      },
    ],
  },
  {
    id: 'entregas',
    title: 'Entregas',
    icon: Truck,
    color: 'text-orange-500 bg-orange-500/10',
    items: [
      {
        question: 'Qual o prazo de entrega?',
        answer: 'O prazo varia de acordo com a região: capitais de 2 a 5 dias úteis, interior de 5 a 10 dias úteis, e regiões remotas de 10 a 15 dias úteis. Calcule no carrinho com seu CEP para ver o prazo exato.',
      },
      {
        question: 'O frete é grátis?',
        answer: 'Sim! Oferecemos frete grátis para compras acima de R$ 199 em todo o Brasil. Para valores menores, o frete é calculado pelo peso e destino.',
      },
      {
        question: 'Vocês entregam em todo o Brasil?',
        answer: 'Sim! Entregamos em todas as regiões do país através dos Correios (PAC e Sedex) e transportadoras parceiras.',
      },
      {
        question: 'Posso escolher a transportadora?',
        answer: 'Sim! No checkout você pode escolher entre as opções disponíveis: Correios (PAC ou Sedex) e transportadoras, com prazos e valores diferentes.',
      },
      {
        question: 'E se eu não estiver em casa na hora da entrega?',
        answer: 'O entregador fará até 3 tentativas em dias diferentes. Caso não haja ninguém, o produto será encaminhado para uma agência dos Correios mais próxima para retirada.',
      },
    ],
  },
  {
    id: 'trocas',
    title: 'Trocas e Devoluções',
    icon: RefreshCw,
    color: 'text-purple-500 bg-purple-500/10',
    items: [
      {
        question: 'Qual o prazo para troca ou devolução?',
        answer: 'Você tem 7 dias após o recebimento para devolução por arrependimento (direito do consumidor) e 30 dias para troca por defeito de fabricação.',
      },
      {
        question: 'Como solicito uma troca?',
        answer: 'Entre em contato conosco pelo WhatsApp ou e-mail informando o número do pedido, produto e motivo da troca. Nossa equipe irá orientar todo o processo.',
      },
      {
        question: 'Quem paga o frete da troca?',
        answer: 'Em caso de defeito de fabricação ou erro da loja, nós pagamos o frete. Para troca por arrependimento ou escolha errada, o frete é por conta do cliente.',
      },
      {
        question: 'O produto precisa estar na embalagem original?',
        answer: 'Sim, para trocas e devoluções o produto deve estar lacrado ou em perfeito estado, com todos os acessórios e embalagem original.',
      },
      {
        question: 'Quanto tempo demora o reembolso?',
        answer: 'Após recebermos e analisarmos o produto, o reembolso é feito em até 7 dias úteis. Para cartão, pode levar até 2 faturas para aparecer o estorno.',
      },
    ],
  },
  {
    id: 'garantia',
    title: 'Garantia',
    icon: Shield,
    color: 'text-red-500 bg-red-500/10',
    items: [
      {
        question: 'Qual a garantia dos produtos?',
        answer: 'Todos os produtos têm garantia de fábrica. O prazo varia conforme o fabricante: Apple 1 ano, Samsung 1 ano, DJI 1 ano, JBL 1 ano. Produtos WavePro têm garantia vitalícia.',
      },
      {
        question: 'Como aciono a garantia?',
        answer: 'Entre em contato conosco com a nota fiscal, fotos ou vídeos mostrando o defeito. Dependendo do caso, faremos a troca imediata ou encaminharemos para assistência autorizada.',
      },
      {
        question: 'A garantia cobre queda ou mau uso?',
        answer: 'Não. A garantia cobre apenas defeitos de fabricação. Danos causados por queda, líquidos, mau uso ou tentativa de reparo por terceiros não são cobertos.',
      },
      {
        question: 'Posso comprar garantia estendida?',
        answer: 'Sim! Para alguns produtos oferecemos extensão de garantia. Consulte as opções na página do produto ou entre em contato.',
      },
    ],
  },
  {
    id: 'loja',
    title: 'Loja Física',
    icon: Store,
    color: 'text-cyan-500 bg-cyan-500/10',
    items: [
      {
        question: 'Vocês têm loja física?',
        answer: 'Sim! Temos duas lojas em Criciúma/SC: Loja Centro na Praça Nereu Ramos, 364 e Loja Marechal na Rua Marechal Deodoro, 195.',
      },
      {
        question: 'Qual o horário de funcionamento?',
        answer: 'Segunda a sexta: 9h às 18h | Sábado: 9h às 13h. Fechamos aos domingos e feriados.',
      },
      {
        question: 'Posso retirar na loja?',
        answer: 'Sim! Escolha "Retirar na loja" no checkout. Após a confirmação do pagamento, seu pedido estará disponível em até 24h.',
      },
      {
        question: 'Os preços da loja física são os mesmos do site?',
        answer: 'Sim! Praticamos os mesmos preços nas lojas físicas e no site. Promoções online também valem nas lojas.',
      },
      {
        question: 'Vocês fazem instalação de película na loja?',
        answer: 'Sim! Oferecemos instalação gratuita de películas WavePro compradas na loja ou no site (apresentando a nota fiscal).',
      },
    ],
  },
];

function FAQAccordion({ category }: { category: FAQCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {category.items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl border border-border overflow-hidden shadow-sm"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-surface/50 transition-colors"
          >
            <span className="font-medium text-text">{item.question}</span>
            <ChevronDown 
              className={`w-5 h-5 text-text-secondary transition-transform duration-300 flex-shrink-0
                ${openIndex === index ? 'rotate-180' : ''}`} 
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 pb-4 text-text-secondary leading-relaxed border-t border-border/50 pt-4">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter FAQ items based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(
      item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.items.length > 0);

  const displayCategories = searchQuery ? filteredCategories : faqCategories;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
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
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text">
                  Perguntas Frequentes
                </h1>
                <p className="text-text-secondary">
                  Encontre respostas para as dúvidas mais comuns
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar pergunta..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Navigation */}
      <section className="sticky top-20 z-30 bg-background/80 backdrop-blur-lg border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                ${!activeCategory 
                  ? 'bg-primary text-white' 
                  : 'bg-surface text-text-secondary hover:bg-surface/80'}`}
            >
              Todas
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                  ${activeCategory === category.id 
                    ? 'bg-primary text-white' 
                    : 'bg-surface text-text-secondary hover:bg-surface/80'}`}
              >
                <category.icon className="w-4 h-4" />
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {displayCategories
              .filter(cat => !activeCategory || cat.id === activeCategory)
              .map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.color}`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-text">{category.title}</h2>
                    <span className="text-sm text-text-secondary bg-surface px-2 py-1 rounded-full">
                      {category.items.length} perguntas
                    </span>
                  </div>
                  <FAQAccordion category={category} />
                </motion.div>
              ))}

            {displayCategories.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
                <p className="text-text-secondary">
                  Nenhuma pergunta encontrada para "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-text mb-4">
              Não encontrou o que procurava?
            </h2>
            <p className="text-text-secondary mb-8">
              Nossa equipe está pronta para ajudar! Entre em contato por WhatsApp ou visite uma de nossas lojas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5548991969371"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href="tel:4830456044"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
                (48) 3045-6044
              </a>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-primary text-text font-medium rounded-xl transition-colors"
              >
                Formulário de Contato
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
