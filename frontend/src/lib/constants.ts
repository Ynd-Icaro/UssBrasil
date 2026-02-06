// Configurações globais da aplicação

export const APP_CONFIG = {
  name: 'USS Brasil',
  description: 'A melhor empresa de tecnologia e acessórios do sul do Brasil',
  url: 'https://ussbrasil.com.br',
  domain: 'ussbrasil.com.br',
  
  // SEO
  seo: {
    title: 'USS Brasil - Tecnologia de Qualidade',
    defaultTitle: 'USS Brasil',
    titleTemplate: '%s | USS Brasil',
    description: 'Há mais de 15 anos oferecendo os melhores produtos em tecnologia, smartphones, acessórios e películas premium. Loja física em Criciúma/SC e entrega para todo o Brasil.',
    keywords: ['tecnologia', 'smartphones', 'acessórios', 'películas', 'wavepro', 'criciuma', 'ussbrasil', 'celular', 'iphone', 'samsung', 'capas'],
    ogImage: '/images/og-image.jpg',
  },
  
  // Contato
  contact: {
    email: 'contato@ussbrasil.com.br',
    phones: {
      comercial: '(48) 3045-6044',
      financeiro: '(48) 99999-4043',
      vendas: '(48) 99196-9371',
      shoppingDella: '(48) 99183-2760',
    },
    whatsapp: '5548991969371',
    whatsappLink: 'https://wa.me/5548991969371',
  },
  
  // Endereços
  locations: [
    {
      name: 'Loja Centro',
      address: 'Praça Nereu Ramos, 364',
      neighborhood: 'Centro',
      city: 'Criciúma',
      state: 'SC',
      zipCode: '88801-505',
      phone: '(48) 3045-6044',
      mapsUrl: 'https://maps.google.com/?q=Praça+Nereu+Ramos+364+Criciuma+SC',
      hours: 'Seg - Sex: 9h às 18h | Sáb: 9h às 13h',
    },
    {
      name: 'Loja Marechal',
      address: 'Rua Marechal Deodoro, 195',
      neighborhood: 'Centro',
      city: 'Criciúma',
      state: 'SC',
      zipCode: '88801-110',
      phone: '(48) 3045-6044',
      mapsUrl: 'https://maps.google.com/?q=Rua+Marechal+Deodoro+195+Criciuma+SC',
      hours: 'Seg - Sex: 9h às 18h | Sáb: 9h às 13h',
    },
  ],
  
  // Redes sociais
  social: {
    instagram: {
      main: '@comercialussbrasil',
      wavepro: '@waveprotecnologia',
      cricell: '@cricellimportsoficial',
    },
    facebook: 'https://facebook.com/ussbrasil',
    youtube: 'https://youtube.com/@ussbrasil',
    linkedin: 'https://linkedin.com/company/ussbrasil',
  },
  
  // Empresa
  company: {
    cnpj: 'XX.XXX.XXX/0001-XX',
    razaoSocial: 'USSBRASIL Comércio de Eletrônicos LTDA',
    foundedYear: 2008,
  },
} as const;

export const SHIPPING_CONFIG = {
  freeShippingMinValue: 199,
  estimatedDays: {
    sedex: { min: 2, max: 5 },
    pac: { min: 5, max: 10 },
    express: { min: 1, max: 3 },
  },
  carriers: [
    { id: 'correios-sedex', name: 'Sedex', logo: '/images/carriers/correios.png' },
    { id: 'correios-pac', name: 'PAC', logo: '/images/carriers/correios.png' },
    { id: 'jadlog', name: 'Jadlog', logo: '/images/carriers/jadlog.png' },
  ],
} as const;

export const PAYMENT_CONFIG = {
  // Parcelas sem juros
  maxInstallmentsNoFee: 12,
  minInstallmentValue: 50,
  
  // Desconto PIX
  pixDiscount: 0.05, // 5%
  
  // Métodos de pagamento
  methods: [
    { id: 'credit', name: 'Cartão de Crédito', icon: 'CreditCard', enabled: true },
    { id: 'pix', name: 'PIX', icon: 'QrCode', enabled: true, discount: 0.05 },
    { id: 'boleto', name: 'Boleto Bancário', icon: 'FileText', enabled: true },
  ],
  
  // Bandeiras aceitas
  cardBrands: ['visa', 'mastercard', 'elo', 'amex', 'hipercard'],
  
  // Taxas (para cálculos internos)
  fees: {
    stripe: 0.0399, // 3.99%
    stripeFixed: 0.39,
    tax: 0.15, // 15%
  },
} as const;

export const PRODUCT_CONFIG = {
  // Paginação
  productsPerPage: 12,
  
  // Filtros
  sortOptions: [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'price-asc', label: 'Menor preço' },
    { value: 'price-desc', label: 'Maior preço' },
    { value: 'name-asc', label: 'A-Z' },
    { value: 'name-desc', label: 'Z-A' },
    { value: 'bestseller', label: 'Mais vendidos' },
    { value: 'rating', label: 'Melhor avaliados' },
  ],
  
  // Limites
  maxCartQuantity: 10,
  minReviewLength: 10,
  
  // Labels
  badges: {
    new: { label: 'Novo', color: 'bg-green-500' },
    featured: { label: 'Destaque', color: 'bg-primary' },
    sale: { label: 'Promoção', color: 'bg-red-500' },
    bestseller: { label: 'Mais Vendido', color: 'bg-purple-500' },
  },
} as const;

export const CATEGORIES = [
  { slug: 'smartphones', name: 'Smartphones', icon: 'Smartphone' },
  { slug: 'tablets', name: 'Tablets', icon: 'Tablet' },
  { slug: 'audio', name: 'Áudio', icon: 'Headphones' },
  { slug: 'smartwatch', name: 'Smartwatch', icon: 'Watch' },
  { slug: 'acessorios', name: 'Acessórios', icon: 'Cable' },
  { slug: 'drones', name: 'Drones', icon: 'Plane' },
  { slug: 'cameras', name: 'Câmeras', icon: 'Camera' },
  { slug: 'informatica', name: 'Informática', icon: 'Laptop' },
  { slug: 'games', name: 'Games', icon: 'Gamepad' },
  { slug: 'casa-inteligente', name: 'Casa Inteligente', icon: 'Home' },
] as const;

export const BRANDS = [
  { slug: 'apple', name: 'Apple', premium: true },
  { slug: 'samsung', name: 'Samsung', premium: true },
  { slug: 'xiaomi', name: 'Xiaomi', premium: false },
  { slug: 'dji', name: 'DJI', premium: true },
  { slug: 'jbl', name: 'JBL', premium: false },
  { slug: 'sony', name: 'Sony', premium: true },
  { slug: 'bose', name: 'Bose', premium: true },
  { slug: 'gopro', name: 'GoPro', premium: true },
  { slug: 'google', name: 'Google', premium: true },
  { slug: 'logitech', name: 'Logitech', premium: false },
  { slug: 'anker', name: 'Anker', premium: false },
  { slug: 'wavepro', name: 'WavePro', premium: true, exclusive: true },
] as const;

export const NAVIGATION = {
  main: [
    { href: '/', label: 'Início' },
    { href: '/products', label: 'Produtos' },
    { 
      href: '#', 
      label: 'Categorias',
      submenu: CATEGORIES.slice(0, 6).map(cat => ({
        href: `/categories/${cat.slug}`,
        label: cat.name,
      })),
    },
    { href: '/wavepro', label: 'WavePro', highlight: true },
    { href: '/contato', label: 'Contato' },
  ],
  
  footer: {
    institucional: [
      { href: '/sobre', label: 'Sobre Nós' },
      { href: '/faq', label: 'Perguntas Frequentes' },
      { href: '/trabalhe-conosco', label: 'Trabalhe Conosco' },
      { href: '/contato', label: 'Contato' },
    ],
    ajuda: [
      { href: '/faq#pedidos', label: 'Como Comprar' },
      { href: '/parcelamento', label: 'Formas de Pagamento' },
      { href: '/entregas', label: 'Entregas' },
      { href: '/trocas', label: 'Trocas e Devoluções' },
    ],
    legal: [
      { href: '/termos', label: 'Termos de Uso' },
      { href: '/privacidade', label: 'Política de Privacidade' },
    ],
  },
} as const;

export const API_ENDPOINTS = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  
  // Products
  products: '/products',
  product: (id: string) => `/products/${id}`,
  productBySlug: (slug: string) => `/products/slug/${slug}`,
  featuredProducts: '/products/featured',
  newProducts: '/products/new',
  
  // Categories
  categories: '/categories',
  category: (id: string) => `/categories/${id}`,
  
  // Brands
  brands: '/brands',
  brand: (id: string) => `/brands/${id}`,
  
  // Cart
  cart: '/cart',
  addToCart: '/cart/add',
  updateCart: '/cart/update',
  removeFromCart: (id: string) => `/cart/remove/${id}`,
  
  // Orders
  orders: '/orders',
  order: (id: string) => `/orders/${id}`,
  createOrder: '/orders/create',
  
  // User
  profile: '/users/profile',
  addresses: '/users/addresses',
  wishlist: '/users/wishlist',
  
  // Reviews
  reviews: (productId: string) => `/reviews/product/${productId}`,
  createReview: '/reviews',
  
  // Shipping
  calculateShipping: '/shipping/calculate',
  
  // Payment
  createPaymentIntent: '/payments/create-intent',
  
  // Contact
  contact: '/contact',
  newsletter: '/newsletter/subscribe',
  
  // CMS
  heroSlides: '/cms/hero-slides',
  banners: '/cms/banners',
  testimonials: '/cms/testimonials',
  pageContent: (slug: string) => `/cms/pages/${slug}`,
} as const;

// Tipos para os endpoints
export type ApiEndpoints = typeof API_ENDPOINTS;
