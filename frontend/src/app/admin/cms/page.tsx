'use client';

import { useEffect, useState } from 'react';
import { 
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Star,
  MessageSquare,
  Settings,
  Layers,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Modal, Badge, Skeleton } from '@/components/ui';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

// Types
interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

interface HomeSection {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  description?: string;
  isVisible: boolean;
  order: number;
  config?: Record<string, any>;
}

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  isActive: boolean;
  order: number;
}

interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: string;
}

type TabType = 'hero' | 'sections' | 'testimonials' | 'config';

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteConfigs, setSiteConfigs] = useState<SiteConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  
  // Editing states
  const [editingHero, setEditingHero] = useState<HeroSlide | null>(null);
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingConfig, setEditingConfig] = useState<SiteConfig | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    mobileImageUrl: '',
    ctaText: '',
    ctaLink: '',
    isActive: true,
  });

  const [sectionForm, setSectionForm] = useState({
    sectionKey: '',
    title: '',
    subtitle: '',
    description: '',
    isVisible: true,
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    avatarUrl: '',
    isActive: true,
  });

  const [configForm, setConfigForm] = useState({
    key: '',
    value: '',
    type: 'string',
  });

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setIsLoading(true);
    try {
      const [heroRes, sectionsRes, testimonialsRes, configRes] = await Promise.all([
        api.get('/cms/hero-slides').catch(() => ({ data: [] })),
        api.get('/cms/sections').catch(() => ({ data: [] })),
        api.get('/cms/testimonials').catch(() => ({ data: [] })),
        api.get('/cms/site-config').catch(() => ({ data: [] })),
      ]);

      setHeroSlides(Array.isArray(heroRes.data) ? heroRes.data : []);
      setSections(Array.isArray(sectionsRes.data) ? sectionsRes.data : []);
      setTestimonials(Array.isArray(testimonialsRes.data) ? testimonialsRes.data : []);
      setSiteConfigs(Array.isArray(configRes.data) ? configRes.data : []);
    } catch (error) {
      console.error('Error loading CMS data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Hero Slide handlers
  const openHeroModal = (slide?: HeroSlide) => {
    if (slide) {
      setEditingHero(slide);
      setHeroForm({
        title: slide.title,
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        imageUrl: slide.imageUrl,
        mobileImageUrl: slide.mobileImageUrl || '',
        ctaText: slide.ctaText || '',
        ctaLink: slide.ctaLink || '',
        isActive: slide.isActive,
      });
    } else {
      setEditingHero(null);
      setHeroForm({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        mobileImageUrl: '',
        ctaText: '',
        ctaLink: '',
        isActive: true,
      });
    }
    setIsHeroModalOpen(true);
  };

  const saveHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingHero) {
        await api.patch(`/cms/hero-slides/${editingHero.id}`, heroForm);
      } else {
        await api.post('/cms/hero-slides', { ...heroForm, order: heroSlides.length });
      }
      await loadAllData();
      setIsHeroModalOpen(false);
    } catch (error) {
      console.error('Error saving hero slide:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteHeroSlide = async (id: string) => {
    if (!confirm('Excluir este slide?')) return;
    try {
      await api.delete(`/cms/hero-slides/${id}`);
      await loadAllData();
    } catch (error) {
      console.error('Error deleting hero slide:', error);
    }
  };

  const toggleHeroActive = async (slide: HeroSlide) => {
    try {
      await api.patch(`/cms/hero-slides/${slide.id}`, { isActive: !slide.isActive });
      await loadAllData();
    } catch (error) {
      console.error('Error toggling hero slide:', error);
    }
  };

  // Testimonial handlers
  const openTestimonialModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setTestimonialForm({
        name: testimonial.name,
        role: testimonial.role || '',
        company: testimonial.company || '',
        content: testimonial.content,
        rating: testimonial.rating,
        avatarUrl: testimonial.avatarUrl || '',
        isActive: testimonial.isActive,
      });
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({
        name: '',
        role: '',
        company: '',
        content: '',
        rating: 5,
        avatarUrl: '',
        isActive: true,
      });
    }
    setIsTestimonialModalOpen(true);
  };

  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingTestimonial) {
        await api.patch(`/cms/testimonials/${editingTestimonial.id}`, testimonialForm);
      } else {
        await api.post('/cms/testimonials', { ...testimonialForm, order: testimonials.length });
      }
      await loadAllData();
      setIsTestimonialModalOpen(false);
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Excluir este depoimento?')) return;
    try {
      await api.delete(`/cms/testimonials/${id}`);
      await loadAllData();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  // Section handlers
  const openSectionModal = (section?: HomeSection) => {
    if (section) {
      setEditingSection(section);
      setSectionForm({
        sectionKey: section.sectionKey,
        title: section.title,
        subtitle: section.subtitle || '',
        description: section.description || '',
        isVisible: section.isVisible,
      });
    } else {
      setEditingSection(null);
      setSectionForm({
        sectionKey: '',
        title: '',
        subtitle: '',
        description: '',
        isVisible: true,
      });
    }
    setIsSectionModalOpen(true);
  };

  const saveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingSection) {
        await api.patch(`/cms/sections/${editingSection.id}`, sectionForm);
      } else {
        await api.post('/cms/sections', { ...sectionForm, order: sections.length });
      }
      await loadAllData();
      setIsSectionModalOpen(false);
    } catch (error) {
      console.error('Error saving section:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSectionVisibility = async (section: HomeSection) => {
    try {
      await api.patch(`/cms/sections/${section.id}`, { isVisible: !section.isVisible });
      await loadAllData();
    } catch (error) {
      console.error('Error toggling section:', error);
    }
  };

  // Config handlers
  const openConfigModal = (config?: SiteConfig) => {
    if (config) {
      setEditingConfig(config);
      setConfigForm({
        key: config.key,
        value: config.value,
        type: config.type,
      });
    } else {
      setEditingConfig(null);
      setConfigForm({
        key: '',
        value: '',
        type: 'string',
      });
    }
    setIsConfigModalOpen(true);
  };

  const saveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingConfig) {
        await api.patch(`/cms/site-config/${editingConfig.id}`, configForm);
      } else {
        await api.post('/cms/site-config', configForm);
      }
      await loadAllData();
      setIsConfigModalOpen(false);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Slides', icon: ImageIcon, count: heroSlides.length },
    { id: 'sections' as TabType, label: 'Seções', icon: Layers, count: sections.length },
    { id: 'testimonials' as TabType, label: 'Depoimentos', icon: MessageSquare, count: testimonials.length },
    { id: 'config' as TabType, label: 'Configurações', icon: Settings, count: siteConfigs.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciador de Conteúdo (CMS)</h1>
          <p className="text-text-secondary">Gerencie o conteúdo dinâmico da sua loja</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Ver Site
            <ExternalLink className="w-3 h-3" />
          </Button>
        </a>
      </div>

      {/* Tabs */}
      <div className="bg-surface rounded-xl border border-border p-1 inline-flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-black'
                  : 'text-text-secondary hover:text-foreground hover:bg-surface-hover'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Hero Slides Tab */}
        {activeTab === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Slides do Hero</h2>
              <Button onClick={() => openHeroModal()} className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Slide
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : heroSlides.length === 0 ? (
              <div className="bg-surface rounded-xl border border-border p-12 text-center">
                <ImageIcon className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary mb-4">Nenhum slide cadastrado</p>
                <Button onClick={() => openHeroModal()}>Criar primeiro slide</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {heroSlides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    layout
                    className={cn(
                      'bg-surface rounded-xl border border-border p-4 flex gap-4',
                      !slide.isActive && 'opacity-60'
                    )}
                  >
                    <div className="flex items-center text-text-muted cursor-move">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="w-40 h-24 bg-surface-hover rounded-lg overflow-hidden flex-shrink-0">
                      {slide.imageUrl ? (
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-text-muted" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">{slide.title}</h3>
                          {slide.subtitle && (
                            <p className="text-sm text-text-muted">{slide.subtitle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant={slide.isActive ? 'success' : 'secondary'}>
                            {slide.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                      </div>
                      {slide.description && (
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                          {slide.description}
                        </p>
                      )}
                      {slide.ctaText && (
                        <p className="text-xs text-primary mt-2">
                          CTA: {slide.ctaText} → {slide.ctaLink}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHeroActive(slide)}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                        title={slide.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {slide.isActive ? (
                          <Eye className="w-4 h-4 text-success" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                      <button
                        onClick={() => openHeroModal(slide)}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => deleteHeroSlide(slide.id)}
                        className="p-2 rounded-lg hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <motion.div
            key="sections"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Seções da Home</h2>
              <Button onClick={() => openSectionModal()} className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Seção
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : sections.length === 0 ? (
              <div className="bg-surface rounded-xl border border-border p-12 text-center">
                <Layers className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary mb-4">Nenhuma seção cadastrada</p>
                <Button onClick={() => openSectionModal()}>Criar primeira seção</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    layout
                    className={cn(
                      'bg-surface rounded-xl border border-border p-4 flex items-center gap-4',
                      !section.isVisible && 'opacity-60'
                    )}
                  >
                    <div className="flex items-center text-text-muted cursor-move">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{section.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {section.sectionKey}
                        </Badge>
                      </div>
                      {section.subtitle && (
                        <p className="text-sm text-text-secondary">{section.subtitle}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={section.isVisible ? 'success' : 'secondary'}>
                        {section.isVisible ? 'Visível' : 'Oculto'}
                      </Badge>
                      <button
                        onClick={() => toggleSectionVisibility(section)}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        {section.isVisible ? (
                          <Eye className="w-4 h-4 text-success" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                      <button
                        onClick={() => openSectionModal(section)}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-text-secondary" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <motion.div
            key="testimonials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Depoimentos</h2>
              <Button onClick={() => openTestimonialModal()} className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Depoimento
              </Button>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : testimonials.length === 0 ? (
              <div className="bg-surface rounded-xl border border-border p-12 text-center">
                <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary mb-4">Nenhum depoimento cadastrado</p>
                <Button onClick={() => openTestimonialModal()}>Criar primeiro depoimento</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    layout
                    className={cn(
                      'bg-surface rounded-xl border border-border p-4',
                      !testimonial.isActive && 'opacity-60'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {testimonial.avatarUrl ? (
                            <img
                              src={testimonial.avatarUrl}
                              alt={testimonial.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary font-bold">
                              {testimonial.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-text-muted">
                            {testimonial.role}
                            {testimonial.company && ` · ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openTestimonialModal(testimonial)}
                          className="p-1.5 rounded hover:bg-surface-hover"
                        >
                          <Pencil className="w-3.5 h-3.5 text-text-secondary" />
                        </button>
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="p-1.5 rounded hover:bg-error/10"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-error" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-4 h-4',
                            i < testimonial.rating
                              ? 'text-primary fill-primary'
                              : 'text-text-muted'
                          )}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-text-secondary line-clamp-3">
                      "{testimonial.content}"
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Config Tab */}
        {activeTab === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Configurações do Site</h2>
              <Button onClick={() => openConfigModal()} className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Config
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : siteConfigs.length === 0 ? (
              <div className="bg-surface rounded-xl border border-border p-12 text-center">
                <Settings className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary mb-4">Nenhuma configuração cadastrada</p>
                <Button onClick={() => openConfigModal()}>Criar primeira configuração</Button>
              </div>
            ) : (
              <div className="bg-surface rounded-xl border border-border divide-y divide-border">
                {siteConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{config.key}</p>
                      <p className="text-sm text-text-secondary truncate max-w-md">
                        {config.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{config.type}</Badge>
                      <button
                        onClick={() => openConfigModal(config)}
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-text-secondary" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Modal */}
      <Modal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        title={editingHero ? 'Editar Slide' : 'Novo Slide'}
        className="max-w-2xl"
      >
        <form onSubmit={saveHeroSlide} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Título"
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              required
            />
            <Input
              label="Subtítulo"
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              rows={3}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="URL da Imagem (Desktop)"
              value={heroForm.imageUrl}
              onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
              placeholder="https://..."
              required
            />
            <Input
              label="URL da Imagem (Mobile)"
              value={heroForm.mobileImageUrl}
              onChange={(e) => setHeroForm({ ...heroForm, mobileImageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Texto do Botão (CTA)"
              value={heroForm.ctaText}
              onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
              placeholder="Ex: Ver Produtos"
            />
            <Input
              label="Link do Botão"
              value={heroForm.ctaLink}
              onChange={(e) => setHeroForm({ ...heroForm, ctaLink: e.target.value })}
              placeholder="/products"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={heroForm.isActive}
              onChange={(e) => setHeroForm({ ...heroForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Slide ativo</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsHeroModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Section Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title={editingSection ? 'Editar Seção' : 'Nova Seção'}
      >
        <form onSubmit={saveSection} className="space-y-4">
          <Input
            label="Chave da Seção"
            value={sectionForm.sectionKey}
            onChange={(e) => setSectionForm({ ...sectionForm, sectionKey: e.target.value })}
            placeholder="ex: featured_products, testimonials"
            required
          />
          <Input
            label="Título"
            value={sectionForm.title}
            onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
            required
          />
          <Input
            label="Subtítulo"
            value={sectionForm.subtitle}
            onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={sectionForm.description}
              onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              rows={3}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sectionForm.isVisible}
              onChange={(e) => setSectionForm({ ...sectionForm, isVisible: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Seção visível</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsSectionModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Testimonial Modal */}
      <Modal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        title={editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
      >
        <form onSubmit={saveTestimonial} className="space-y-4">
          <Input
            label="Nome"
            value={testimonialForm.name}
            onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
            required
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Cargo/Função"
              value={testimonialForm.role}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
              placeholder="Ex: CEO, Cliente"
            />
            <Input
              label="Empresa"
              value={testimonialForm.company}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Depoimento</label>
            <textarea
              value={testimonialForm.content}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Avaliação</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      'w-6 h-6 transition-colors',
                      star <= testimonialForm.rating
                        ? 'text-primary fill-primary'
                        : 'text-text-muted'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <Input
            label="URL do Avatar"
            value={testimonialForm.avatarUrl}
            onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
            placeholder="https://..."
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={testimonialForm.isActive}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm">Depoimento ativo</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsTestimonialModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Config Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title={editingConfig ? 'Editar Configuração' : 'Nova Configuração'}
      >
        <form onSubmit={saveConfig} className="space-y-4">
          <Input
            label="Chave"
            value={configForm.key}
            onChange={(e) => setConfigForm({ ...configForm, key: e.target.value })}
            placeholder="ex: site_name, primary_color"
            required
            disabled={!!editingConfig}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={configForm.type}
              onChange={(e) => setConfigForm({ ...configForm, type: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary"
            >
              <option value="string">Texto</option>
              <option value="number">Número</option>
              <option value="boolean">Booleano</option>
              <option value="json">JSON</option>
              <option value="color">Cor</option>
              <option value="url">URL</option>
            </select>
          </div>
          {configForm.type === 'color' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Valor</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={configForm.value || '#000000'}
                  onChange={(e) => setConfigForm({ ...configForm, value: e.target.value })}
                  className="w-12 h-12 rounded border border-border cursor-pointer"
                />
                <Input
                  value={configForm.value}
                  onChange={(e) => setConfigForm({ ...configForm, value: e.target.value })}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          ) : configForm.type === 'json' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Valor (JSON)</label>
              <textarea
                value={configForm.value}
                onChange={(e) => setConfigForm({ ...configForm, value: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary resize-none font-mono text-sm"
                rows={6}
                placeholder='{"key": "value"}'
              />
            </div>
          ) : (
            <Input
              label="Valor"
              value={configForm.value}
              onChange={(e) => setConfigForm({ ...configForm, value: e.target.value })}
              required
            />
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsConfigModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
