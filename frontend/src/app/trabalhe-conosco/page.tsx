'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  Users,
  Heart,
  Zap,
  Award,
  ChevronRight,
  Upload,
  Send,
  CheckCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const jobSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  position: z.string().min(1, 'Selecione uma vaga'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
  experience: z.string().min(10, 'Descreva sua experiência'),
  motivation: z.string().min(20, 'Descreva sua motivação'),
});

type JobForm = z.infer<typeof jobSchema>;

const openPositions = [
  {
    id: 'vendedor',
    title: 'Vendedor(a)',
    department: 'Vendas',
    location: 'Criciúma, SC',
    type: 'CLT - Presencial',
    description: 'Atendimento ao cliente em loja, vendas de produtos de tecnologia, fidelização de clientes.',
    requirements: [
      'Experiência em vendas (desejável em tecnologia)',
      'Excelente comunicação',
      'Proatividade e foco em resultados',
      'Disponibilidade para horário comercial',
    ],
  },
  {
    id: 'tecnico',
    title: 'Técnico em Informática',
    department: 'Suporte',
    location: 'Criciúma, SC',
    type: 'CLT - Presencial',
    description: 'Manutenção e configuração de smartphones, tablets e notebooks. Instalação de películas.',
    requirements: [
      'Conhecimento em hardware e software',
      'Experiência com smartphones',
      'Atenção a detalhes',
      'Curso técnico na área (desejável)',
    ],
  },
  {
    id: 'marketing',
    title: 'Analista de Marketing Digital',
    department: 'Marketing',
    location: 'Criciúma, SC / Híbrido',
    type: 'CLT - Híbrido',
    description: 'Gestão de redes sociais, criação de conteúdo, campanhas de performance, e-mail marketing.',
    requirements: [
      'Experiência com gestão de redes sociais',
      'Conhecimento em Meta Ads e Google Ads',
      'Domínio de ferramentas de design (Canva, Figma)',
      'Criatividade e organização',
    ],
  },
  {
    id: 'logistica',
    title: 'Auxiliar de Logística',
    department: 'Operações',
    location: 'Criciúma, SC',
    type: 'CLT - Presencial',
    description: 'Separação de pedidos, embalagem, conferência de estoque, envio de mercadorias.',
    requirements: [
      'Organização e agilidade',
      'Conhecimento em operação de e-commerce (desejável)',
      'Disponibilidade para horário comercial',
      'Ensino médio completo',
    ],
  },
];

const benefits = [
  { icon: Heart, title: 'Plano de Saúde', description: 'Cobertura completa para você e família' },
  { icon: Zap, title: 'Vale Alimentação', description: 'Benefício mensal para suas refeições' },
  { icon: Award, title: 'Bonificação', description: 'Premiações por metas alcançadas' },
  { icon: Users, title: 'Ambiente Dinâmico', description: 'Equipe jovem e colaborativa' },
];

const values = [
  'Crescimento profissional acelerado',
  'Treinamentos constantes',
  'Desconto em produtos',
  'Ambiente descontraído',
  'Horário flexível (algumas vagas)',
  'Day off no aniversário',
];

export default function TrabalhePage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      reset();
      setSelectedPosition(null);
      toast.success('Candidatura enviada com sucesso!');
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast.error('Erro ao enviar candidatura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPosition = (positionId: string) => {
    setSelectedPosition(selectedPosition === positionId ? null : positionId);
    setValue('position', positionId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
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
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-text">
                  Trabalhe Conosco
                </h1>
                <p className="text-text-secondary text-lg mt-1">
                  Faça parte do time USS Brasil
                </p>
              </div>
            </div>
            <p className="text-text-secondary text-lg leading-relaxed">
              Estamos sempre em busca de talentos apaixonados por tecnologia e atendimento. 
              Se você quer crescer profissionalmente em um ambiente dinâmico e inovador, 
              confira nossas vagas!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-text mb-4">Por que trabalhar na USS Brasil?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Oferecemos um ambiente de trabalho excepcional com benefícios que fazem a diferença
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-border shadow-sm text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-text mb-2">{benefit.title}</h3>
                <p className="text-sm text-text-secondary">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Extra benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-white rounded-2xl p-8 border border-border"
          >
            <h3 className="font-semibold text-text mb-6 text-center">Outros benefícios</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-text-secondary">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-text mb-4">Vagas Abertas</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Confira as oportunidades disponíveis e candidate-se à vaga ideal para você
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl border transition-all duration-300
                  ${selectedPosition === position.id 
                    ? 'border-primary shadow-lg shadow-primary/10' 
                    : 'border-border hover:border-primary/50'}`}
              >
                <button
                  onClick={() => handleSelectPosition(position.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text">{position.title}</h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {position.department}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`w-6 h-6 text-text-secondary transition-transform duration-300
                        ${selectedPosition === position.id ? 'rotate-90' : ''}`} 
                    />
                  </div>
                </button>

                {selectedPosition === position.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-6 pb-6 border-t border-border"
                  >
                    <div className="pt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-text mb-2">Descrição</h4>
                        <p className="text-text-secondary">{position.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-text mb-2">Requisitos</h4>
                        <ul className="space-y-2">
                          {position.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-text-secondary">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text mb-4">Candidate-se</h2>
              <p className="text-text-secondary">
                Preencha o formulário abaixo e entraremos em contato em breve
              </p>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-green-200 p-8 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text mb-2">
                  Candidatura Enviada!
                </h3>
                <p className="text-text-secondary">
                  Obrigado pelo interesse em fazer parte do nosso time. 
                  Nossa equipe de RH analisará seu perfil e entrará em contato em breve.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-border p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Seu nome"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="(00) 00000-0000"
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Sua cidade"
                    />
                    {errors.city && (
                      <span className="text-red-500 text-sm mt-1">{errors.city.message}</span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-2">
                      Vaga de Interesse *
                    </label>
                    <select
                      {...register('position')}
                      value={selectedPosition || ''}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Selecione uma vaga</option>
                      {openPositions.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.title} - {pos.location}
                        </option>
                      ))}
                    </select>
                    {errors.position && (
                      <span className="text-red-500 text-sm mt-1">{errors.position.message}</span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-2">
                      LinkedIn (opcional)
                    </label>
                    <input
                      type="url"
                      {...register('linkedin')}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="https://linkedin.com/in/seuperfil"
                    />
                    {errors.linkedin && (
                      <span className="text-red-500 text-sm mt-1">{errors.linkedin.message}</span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-2">
                      Experiência Profissional *
                    </label>
                    <textarea
                      {...register('experience')}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="Descreva suas experiências anteriores..."
                    />
                    {errors.experience && (
                      <span className="text-red-500 text-sm mt-1">{errors.experience.message}</span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-2">
                      Por que você quer trabalhar na USS Brasil? *
                    </label>
                    <textarea
                      {...register('motivation')}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="Conte-nos sobre sua motivação..."
                    />
                    {errors.motivation && (
                      <span className="text-red-500 text-sm mt-1">{errors.motivation.message}</span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Candidatura
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
