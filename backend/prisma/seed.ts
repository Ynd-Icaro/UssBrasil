import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ==================== USERS ====================
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ussbrasil.com' },
    update: {},
    create: {
      email: 'admin@ussbrasil.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'USSBRASIL',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  const customerPassword = await bcrypt.hash('cliente123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'cliente@teste.com' },
    update: {},
    create: {
      email: 'cliente@teste.com',
      password: customerPassword,
      firstName: 'João',
      lastName: 'Silva',
      phone: '(11) 99999-9999',
      role: Role.USER,
      emailVerified: true,
    },
  });
  console.log('✅ Test customer created:', customer.email);

  // ==================== CATEGORIES ====================
  const categoriesData = [
    { name: 'Smartphones', slug: 'smartphones', description: 'Os melhores smartphones do mercado', image: '/images/categories/smartphones.jpg' },
    { name: 'Tablets', slug: 'tablets', description: 'Tablets para trabalho, estudo e entretenimento', image: '/images/categories/tablets.jpg' },
    { name: 'Áudio', slug: 'audio', description: 'Fones de ouvido, caixas de som e acessórios de áudio', image: '/images/categories/audio.jpg' },
    { name: 'Drones', slug: 'drones', description: 'Drones profissionais e recreativos', image: '/images/categories/drones.jpg' },
    { name: 'Acessórios', slug: 'acessorios', description: 'Capas, películas, carregadores e muito mais', image: '/images/categories/acessorios.jpg' },
    { name: 'Smartwatch', slug: 'smartwatch', description: 'Relógios inteligentes e smartbands', image: '/images/categories/smartwatch.jpg' },
    { name: 'Câmeras', slug: 'cameras', description: 'Câmeras de ação e equipamentos fotográficos', image: '/images/categories/cameras.jpg' },
    { name: 'Informática', slug: 'informatica', description: 'Notebooks, periféricos e acessórios', image: '/images/categories/informatica.jpg' },
    { name: 'Games', slug: 'games', description: 'Consoles, jogos e acessórios gamer', image: '/images/categories/games.jpg' },
    { name: 'Casa Inteligente', slug: 'casa-inteligente', description: 'Automação residencial e assistentes virtuais', image: '/images/categories/casa-inteligente.jpg' },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created:', Object.keys(categories).length);

  // ==================== BRANDS ====================
  const brandsData = [
    { name: 'Apple', slug: 'apple', description: 'Think Different', logo: '/images/brands/apple.png' },
    { name: 'Samsung', slug: 'samsung', description: 'Inspire the World', logo: '/images/brands/samsung.png' },
    { name: 'DJI', slug: 'dji', description: 'The Future of Possible', logo: '/images/brands/dji.png' },
    { name: 'JBL', slug: 'jbl', description: 'Dare to Listen', logo: '/images/brands/jbl.png' },
    { name: 'Xiaomi', slug: 'xiaomi', description: 'Innovation for Everyone', logo: '/images/brands/xiaomi.png' },
    { name: 'Sony', slug: 'sony', description: 'Be Moved', logo: '/images/brands/sony.png' },
    { name: 'Bose', slug: 'bose', description: 'Better Sound Through Research', logo: '/images/brands/bose.png' },
    { name: 'GoPro', slug: 'gopro', description: 'Be a Hero', logo: '/images/brands/gopro.png' },
    { name: 'Nintendo', slug: 'nintendo', description: 'Putting Smiles on Faces', logo: '/images/brands/nintendo.png' },
    { name: 'Google', slug: 'google', description: 'Organize the Worlds Information', logo: '/images/brands/google.png' },
    { name: 'Logitech', slug: 'logitech', description: 'Defy Logic', logo: '/images/brands/logitech.png' },
    { name: 'Anker', slug: 'anker', description: 'Charge Fast, Live More', logo: '/images/brands/anker.png' },
    { name: 'WavePro', slug: 'wavepro', description: 'Marca exclusiva USS Brasil', logo: '/images/brands/wavepro.png' },
  ];

  const brands: Record<string, any> = {};
  for (const brand of brandsData) {
    brands[brand.slug] = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }
  console.log('✅ Brands created:', Object.keys(brands).length);

  // ==================== PRODUCTS ====================
  console.log('📦 Creating products...');

  const productsData = [
    // APPLE PRODUCTS
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'O iPhone mais poderoso com chip A17 Pro, câmera de 48MP, titânio e Dynamic Island.',
      shortDescription: 'Chip A17 Pro, 48MP, Titânio, 6.7"',
      price: 9499.00,
      comparePrice: 10499.00,
      stock: 50,
      sku: 'APL-IP15PM-256',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.221,
      categorySlug: 'smartphones',
      brandSlug: 'apple',
      images: [{ url: '/images/products/iphone-15-pro-max-1.jpg', alt: 'iPhone 15 Pro Max', position: 0, isMain: true }],
      variants: [
        { name: 'Titânio Natural 256GB', sku: 'APL-IP15PM-TN256', options: { cor: 'Titânio Natural', armazenamento: '256GB' }, stock: 15, price: 9499.00 },
        { name: 'Titânio Azul 512GB', sku: 'APL-IP15PM-TA512', options: { cor: 'Titânio Azul', armazenamento: '512GB' }, stock: 10, price: 10999.00 },
      ],
    },
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'iPhone 15 Pro com chip A17 Pro, câmera de 48MP e acabamento em titânio.',
      shortDescription: 'Chip A17 Pro, 48MP, 6.1"',
      price: 8499.00,
      comparePrice: 9299.00,
      stock: 45,
      sku: 'APL-IP15P-128',
      isActive: true,
      isFeatured: true,
      weight: 0.187,
      categorySlug: 'smartphones',
      brandSlug: 'apple',
      images: [{ url: '/images/products/iphone-15-pro-1.jpg', alt: 'iPhone 15 Pro', position: 0, isMain: true }],
      variants: [
        { name: 'Titânio Natural 128GB', sku: 'APL-IP15P-TN128', options: { cor: 'Titânio Natural', armazenamento: '128GB' }, stock: 20, price: 8499.00 },
        { name: 'Titânio Preto 256GB', sku: 'APL-IP15P-TP256', options: { cor: 'Titânio Preto', armazenamento: '256GB' }, stock: 15, price: 9499.00 },
      ],
    },
    {
      name: 'iPhone 15',
      slug: 'iphone-15',
      description: 'iPhone 15 com Dynamic Island, câmera de 48MP e chip A16 Bionic.',
      shortDescription: 'A16 Bionic, 48MP, Dynamic Island',
      price: 5999.00,
      comparePrice: 6499.00,
      stock: 80,
      sku: 'APL-IP15-128',
      isActive: true,
      isFeatured: true,
      weight: 0.171,
      categorySlug: 'smartphones',
      brandSlug: 'apple',
      images: [{ url: '/images/products/iphone-15-1.jpg', alt: 'iPhone 15', position: 0, isMain: true }],
      variants: [
        { name: 'Azul 128GB', sku: 'APL-IP15-AZ128', options: { cor: 'Azul', armazenamento: '128GB' }, stock: 30, price: 5999.00 },
        { name: 'Rosa 256GB', sku: 'APL-IP15-RS256', options: { cor: 'Rosa', armazenamento: '256GB' }, stock: 25, price: 6999.00 },
      ],
    },
    {
      name: 'AirPods Pro 2ª Geração',
      slug: 'airpods-pro-2',
      description: 'AirPods Pro com cancelamento de ruído 2x mais eficaz e Áudio Espacial.',
      shortDescription: 'ANC 2x melhor, Áudio Espacial, USB-C',
      price: 2299.00,
      comparePrice: 2599.00,
      stock: 120,
      sku: 'APL-APP2-USBC',
      isActive: true,
      isFeatured: true,
      weight: 0.061,
      categorySlug: 'audio',
      brandSlug: 'apple',
      images: [{ url: '/images/products/airpods-pro-2-1.jpg', alt: 'AirPods Pro 2', position: 0, isMain: true }],
    },
    {
      name: 'AirPods Max',
      slug: 'airpods-max',
      description: 'Fones over-ear premium com ANC de alta fidelidade e Áudio Espacial.',
      shortDescription: 'Over-ear Premium, ANC Hi-Fi, 20h',
      price: 4999.00,
      comparePrice: 5499.00,
      stock: 30,
      sku: 'APL-APM-SLV',
      isActive: true,
      isFeatured: true,
      weight: 0.385,
      categorySlug: 'audio',
      brandSlug: 'apple',
      images: [{ url: '/images/products/airpods-max-1.jpg', alt: 'AirPods Max', position: 0, isMain: true }],
      variants: [
        { name: 'Prata', sku: 'APL-APM-SLV', options: { cor: 'Prata' }, stock: 15, price: 4999.00 },
        { name: 'Cinza Espacial', sku: 'APL-APM-SGY', options: { cor: 'Cinza Espacial' }, stock: 15, price: 4999.00 },
      ],
    },
    {
      name: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      description: 'Smartwatch com chip S9, Double Tap e tela de 2000 nits.',
      shortDescription: 'Chip S9, Double Tap, 2000 nits',
      price: 4499.00,
      comparePrice: 4799.00,
      stock: 75,
      sku: 'APL-AWS9-41',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.032,
      categorySlug: 'smartwatch',
      brandSlug: 'apple',
      images: [{ url: '/images/products/apple-watch-9-1.jpg', alt: 'Apple Watch Series 9', position: 0, isMain: true }],
      variants: [
        { name: 'GPS 41mm Meia-noite', sku: 'APL-AW9-41MN', options: { tamanho: '41mm', cor: 'Meia-noite' }, stock: 25, price: 4499.00 },
        { name: 'GPS 45mm Estelar', sku: 'APL-AW9-45ES', options: { tamanho: '45mm', cor: 'Estelar' }, stock: 25, price: 4999.00 },
      ],
    },
    {
      name: 'Apple Watch Ultra 2',
      slug: 'apple-watch-ultra-2',
      description: 'Apple Watch mais robusto com titânio 49mm e tela de 3000 nits.',
      shortDescription: 'Titânio 49mm, 3000 nits, GPS Dual',
      price: 8999.00,
      stock: 25,
      sku: 'APL-AWU2-TIT',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.062,
      categorySlug: 'smartwatch',
      brandSlug: 'apple',
      images: [{ url: '/images/products/apple-watch-ultra-2-1.jpg', alt: 'Apple Watch Ultra 2', position: 0, isMain: true }],
    },
    {
      name: 'iPad Pro M4 12.9"',
      slug: 'ipad-pro-m4',
      description: 'iPad mais poderoso com chip M4 e tela OLED Tandem de 12.9".',
      shortDescription: 'Chip M4, OLED 12.9", 5.1mm fino',
      price: 12999.00,
      comparePrice: 13999.00,
      stock: 30,
      sku: 'APL-IPDP-M4-256',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.682,
      categorySlug: 'tablets',
      brandSlug: 'apple',
      images: [{ url: '/images/products/ipad-pro-m4-1.jpg', alt: 'iPad Pro M4', position: 0, isMain: true }],
      variants: [
        { name: '11" Wi-Fi 256GB', sku: 'APL-IPDP-11W256', options: { tela: '11"', armazenamento: '256GB' }, stock: 15, price: 9999.00 },
        { name: '12.9" Wi-Fi 512GB', sku: 'APL-IPDP-13W512', options: { tela: '12.9"', armazenamento: '512GB' }, stock: 15, price: 15999.00 },
      ],
    },
    {
      name: 'MacBook Air M3 15"',
      slug: 'macbook-air-m3',
      description: 'Notebook com chip M3, tela Liquid Retina de 15.3" e 18h de bateria.',
      shortDescription: 'Chip M3, 15.3" Liquid Retina, 18h',
      price: 14999.00,
      comparePrice: 15999.00,
      stock: 35,
      sku: 'APL-MBA-M3-15',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 1.51,
      categorySlug: 'informatica',
      brandSlug: 'apple',
      images: [{ url: '/images/products/macbook-air-m3-1.jpg', alt: 'MacBook Air M3', position: 0, isMain: true }],
      variants: [
        { name: '13" M3 8GB/256GB', sku: 'APL-MBA-13MN', options: { tela: '13.6"', memoria: '8GB' }, stock: 15, price: 11999.00 },
        { name: '15" M3 16GB/512GB', sku: 'APL-MBA-15CZ', options: { tela: '15.3"', memoria: '16GB' }, stock: 20, price: 17999.00 },
      ],
    },
    // SAMSUNG PRODUCTS
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'galaxy-s24-ultra',
      description: 'Galaxy com Galaxy AI, câmera de 200MP e S Pen integrada.',
      shortDescription: 'SD8 Gen 3, 200MP, Galaxy AI, S Pen',
      price: 8999.00,
      comparePrice: 9999.00,
      stock: 60,
      sku: 'SAM-S24U-256',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.232,
      categorySlug: 'smartphones',
      brandSlug: 'samsung',
      images: [{ url: '/images/products/galaxy-s24-ultra-1.jpg', alt: 'Galaxy S24 Ultra', position: 0, isMain: true }],
      variants: [
        { name: 'Titanium Black 256GB', sku: 'SAM-S24U-TB256', options: { cor: 'Titanium Black', armazenamento: '256GB' }, stock: 20, price: 8999.00 },
        { name: 'Titanium Violet 512GB', sku: 'SAM-S24U-TV512', options: { cor: 'Titanium Violet', armazenamento: '512GB' }, stock: 20, price: 9999.00 },
      ],
    },
    {
      name: 'Samsung Galaxy Z Fold 5',
      slug: 'galaxy-z-fold-5',
      description: 'Smartphone dobrável com tela principal de 7.6" e tela frontal de 6.2".',
      shortDescription: 'Dobrável 7.6", Flex Mode, 50MP',
      price: 11999.00,
      comparePrice: 12999.00,
      stock: 25,
      sku: 'SAM-ZF5-256',
      isActive: true,
      isFeatured: true,
      weight: 0.253,
      categorySlug: 'smartphones',
      brandSlug: 'samsung',
      images: [{ url: '/images/products/galaxy-z-fold-5-1.jpg', alt: 'Galaxy Z Fold 5', position: 0, isMain: true }],
      variants: [
        { name: 'Phantom Black 256GB', sku: 'SAM-ZF5-PB256', options: { cor: 'Phantom Black', armazenamento: '256GB' }, stock: 15, price: 11999.00 },
        { name: 'Icy Blue 512GB', sku: 'SAM-ZF5-IB512', options: { cor: 'Icy Blue', armazenamento: '512GB' }, stock: 10, price: 12999.00 },
      ],
    },
    {
      name: 'Samsung Galaxy Buds 3 Pro',
      slug: 'galaxy-buds-3-pro',
      description: 'Fones premium com Galaxy AI, ANC 2x e som Hi-Fi 24bit.',
      shortDescription: 'Galaxy AI, ANC 2x, Hi-Fi 24bit',
      price: 1799.00,
      comparePrice: 1999.00,
      stock: 100,
      sku: 'SAM-GB3P-SLV',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.054,
      categorySlug: 'audio',
      brandSlug: 'samsung',
      images: [{ url: '/images/products/galaxy-buds-3-pro-1.jpg', alt: 'Galaxy Buds 3 Pro', position: 0, isMain: true }],
    },
    {
      name: 'Samsung Galaxy Watch 7',
      slug: 'galaxy-watch-7',
      description: 'Smartwatch com sensor BioActive e Wear OS.',
      shortDescription: 'BioActive, Wear OS, GPS Dual',
      price: 2499.00,
      stock: 80,
      sku: 'SAM-GW7-44',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.034,
      categorySlug: 'smartwatch',
      brandSlug: 'samsung',
      images: [{ url: '/images/products/galaxy-watch-7-1.jpg', alt: 'Galaxy Watch 7', position: 0, isMain: true }],
      variants: [
        { name: '40mm Green', sku: 'SAM-GW7-40GR', options: { tamanho: '40mm', cor: 'Green' }, stock: 40, price: 2499.00 },
        { name: '44mm Silver', sku: 'SAM-GW7-44SL', options: { tamanho: '44mm', cor: 'Silver' }, stock: 40, price: 2799.00 },
      ],
    },
    {
      name: 'Samsung Galaxy Tab S9 Ultra',
      slug: 'galaxy-tab-s9-ultra',
      description: 'Tablet Android com tela de 14.6" e S Pen incluída.',
      shortDescription: '14.6" AMOLED, SD8 Gen 2, S Pen',
      price: 9999.00,
      stock: 20,
      sku: 'SAM-TS9U-256',
      isActive: true,
      isFeatured: true,
      weight: 0.732,
      categorySlug: 'tablets',
      brandSlug: 'samsung',
      images: [{ url: '/images/products/galaxy-tab-s9-ultra-1.jpg', alt: 'Galaxy Tab S9 Ultra', position: 0, isMain: true }],
    },
    // DJI PRODUCTS
    {
      name: 'DJI Mavic 3 Pro',
      slug: 'dji-mavic-3-pro',
      description: 'Drone profissional com câmera tripla Hasselblad e 43min de voo.',
      shortDescription: 'Câmera Tripla Hasselblad, 5.1K, 43min',
      price: 14999.00,
      stock: 20,
      sku: 'DJI-M3P-STD',
      isActive: true,
      isFeatured: true,
      weight: 0.958,
      categorySlug: 'drones',
      brandSlug: 'dji',
      images: [{ url: '/images/products/dji-mavic-3-pro-1.jpg', alt: 'DJI Mavic 3 Pro', position: 0, isMain: true }],
      variants: [
        { name: 'Standard', sku: 'DJI-M3P-STD', options: { kit: 'Standard' }, stock: 10, price: 14999.00 },
        { name: 'Fly More Combo', sku: 'DJI-M3P-FMC', options: { kit: 'Fly More Combo' }, stock: 10, price: 18999.00 },
      ],
    },
    {
      name: 'DJI Mini 4 Pro',
      slug: 'dji-mini-4-pro',
      description: 'Drone compacto (<249g) com câmera 4K/60fps e detecção omnidirecional.',
      shortDescription: '<249g, 4K/60fps, Omnidirecional',
      price: 6999.00,
      comparePrice: 7499.00,
      stock: 40,
      sku: 'DJI-M4P-RC2',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.249,
      categorySlug: 'drones',
      brandSlug: 'dji',
      images: [{ url: '/images/products/dji-mini-4-pro-1.jpg', alt: 'DJI Mini 4 Pro', position: 0, isMain: true }],
      variants: [
        { name: 'RC-N2', sku: 'DJI-M4P-RCN2', options: { controle: 'RC-N2' }, stock: 20, price: 5999.00 },
        { name: 'DJI RC 2', sku: 'DJI-M4P-RC2', options: { controle: 'DJI RC 2' }, stock: 20, price: 6999.00 },
      ],
    },
    {
      name: 'DJI Osmo Pocket 3',
      slug: 'dji-osmo-pocket-3',
      description: 'Câmera de bolso com gimbal 3 eixos e sensor de 1".',
      shortDescription: 'Gimbal 3 eixos, Sensor 1", 4K/120',
      price: 4499.00,
      stock: 35,
      sku: 'DJI-OP3-STD',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.179,
      categorySlug: 'cameras',
      brandSlug: 'dji',
      images: [{ url: '/images/products/dji-osmo-pocket-3-1.jpg', alt: 'DJI Osmo Pocket 3', position: 0, isMain: true }],
    },
    // JBL PRODUCTS
    {
      name: 'JBL Charge 5',
      slug: 'jbl-charge-5',
      description: 'Caixa de som portátil com IP67 e 20h de bateria.',
      shortDescription: 'IP67, 20h bateria, PartyBoost',
      price: 999.00,
      comparePrice: 1199.00,
      stock: 150,
      sku: 'JBL-CHG5-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.960,
      categorySlug: 'audio',
      brandSlug: 'jbl',
      images: [{ url: '/images/products/jbl-charge-5-1.jpg', alt: 'JBL Charge 5', position: 0, isMain: true }],
      variants: [
        { name: 'Preto', sku: 'JBL-CH5-PRT', options: { cor: 'Preto' }, stock: 50, price: 999.00 },
        { name: 'Azul', sku: 'JBL-CH5-AZL', options: { cor: 'Azul' }, stock: 50, price: 999.00 },
        { name: 'Vermelho', sku: 'JBL-CH5-VRM', options: { cor: 'Vermelho' }, stock: 50, price: 999.00 },
      ],
    },
    {
      name: 'JBL Flip 6',
      slug: 'jbl-flip-6',
      description: 'Caixa portátil compacta com IP67 e 12h de bateria.',
      shortDescription: 'IP67, 12h bateria, PartyBoost',
      price: 699.00,
      comparePrice: 799.00,
      stock: 200,
      sku: 'JBL-FLP6-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.550,
      categorySlug: 'audio',
      brandSlug: 'jbl',
      images: [{ url: '/images/products/jbl-flip-6-1.jpg', alt: 'JBL Flip 6', position: 0, isMain: true }],
      variants: [
        { name: 'Preto', sku: 'JBL-FLP6-PRT', options: { cor: 'Preto' }, stock: 70, price: 699.00 },
        { name: 'Rosa', sku: 'JBL-FLP6-RSA', options: { cor: 'Rosa' }, stock: 65, price: 699.00 },
        { name: 'Azul', sku: 'JBL-FLP6-AZL', options: { cor: 'Azul' }, stock: 65, price: 699.00 },
      ],
    },
    {
      name: 'JBL Live Pro 2 TWS',
      slug: 'jbl-live-pro-2',
      description: 'Fones TWS premium com ANC e 40h de bateria total.',
      shortDescription: 'ANC Premium, 40h total, 6 mics',
      price: 899.00,
      comparePrice: 999.00,
      stock: 120,
      sku: 'JBL-LP2-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.060,
      categorySlug: 'audio',
      brandSlug: 'jbl',
      images: [{ url: '/images/products/jbl-live-pro-2-1.jpg', alt: 'JBL Live Pro 2', position: 0, isMain: true }],
    },
    {
      name: 'JBL Boombox 3',
      slug: 'jbl-boombox-3',
      description: 'Caixa de som mais potente da JBL com 24h de bateria.',
      shortDescription: 'Som Massivo, 24h, IP67, PartyBoost',
      price: 3499.00,
      stock: 25,
      sku: 'JBL-BB3-BLK',
      isActive: true,
      isFeatured: true,
      weight: 6.700,
      categorySlug: 'audio',
      brandSlug: 'jbl',
      images: [{ url: '/images/products/jbl-boombox-3-1.jpg', alt: 'JBL Boombox 3', position: 0, isMain: true }],
    },
    // XIAOMI PRODUCTS
    {
      name: 'Xiaomi 14 Ultra',
      slug: 'xiaomi-14-ultra',
      description: 'Flagship com câmera Leica quad de 50MP e Snapdragon 8 Gen 3.',
      shortDescription: 'Leica Quad 50MP, SD8 Gen 3, 90W',
      price: 7999.00,
      stock: 25,
      sku: 'XM-14U-256',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.220,
      categorySlug: 'smartphones',
      brandSlug: 'xiaomi',
      images: [{ url: '/images/products/xiaomi-14-ultra-1.jpg', alt: 'Xiaomi 14 Ultra', position: 0, isMain: true }],
      variants: [
        { name: 'Black 256GB', sku: 'XM-14U-BLK256', options: { cor: 'Black', armazenamento: '256GB' }, stock: 15, price: 7999.00 },
        { name: 'White 512GB', sku: 'XM-14U-WHT512', options: { cor: 'White', armazenamento: '512GB' }, stock: 10, price: 8999.00 },
      ],
    },
    {
      name: 'Xiaomi 14',
      slug: 'xiaomi-14',
      description: 'Compacto com câmera Leica e tela de 3000 nits.',
      shortDescription: 'Leica 50MP, Compacto, 3000 nits',
      price: 5499.00,
      comparePrice: 5999.00,
      stock: 40,
      sku: 'XM-14-256',
      isActive: true,
      isFeatured: true,
      weight: 0.193,
      categorySlug: 'smartphones',
      brandSlug: 'xiaomi',
      images: [{ url: '/images/products/xiaomi-14-1.jpg', alt: 'Xiaomi 14', position: 0, isMain: true }],
    },
    {
      name: 'Xiaomi Watch 2 Pro',
      slug: 'xiaomi-watch-2-pro',
      description: 'Smartwatch com Wear OS e GPS dual-band.',
      shortDescription: 'Wear OS, SD W5+, GPS Dual, 65h',
      price: 1899.00,
      stock: 60,
      sku: 'XM-W2P-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.054,
      categorySlug: 'smartwatch',
      brandSlug: 'xiaomi',
      images: [{ url: '/images/products/xiaomi-watch-2-pro-1.jpg', alt: 'Xiaomi Watch 2 Pro', position: 0, isMain: true }],
    },
    {
      name: 'Xiaomi Buds 4 Pro',
      slug: 'xiaomi-buds-4-pro',
      description: 'Fones TWS premium com ANC de 48dB e Hi-Res Audio.',
      shortDescription: 'ANC 48dB, Hi-Res, 38h total',
      price: 899.00,
      comparePrice: 999.00,
      stock: 100,
      sku: 'XM-B4P-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.049,
      categorySlug: 'audio',
      brandSlug: 'xiaomi',
      images: [{ url: '/images/products/xiaomi-buds-4-pro-1.jpg', alt: 'Xiaomi Buds 4 Pro', position: 0, isMain: true }],
    },
    // SONY PRODUCTS
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Melhor cancelamento de ruído do mundo com 30h de bateria.',
      shortDescription: 'ANC líder mundial, 30h, 250g',
      price: 2299.00,
      comparePrice: 2499.00,
      stock: 70,
      sku: 'SNY-WH1000XM5-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.250,
      categorySlug: 'audio',
      brandSlug: 'sony',
      images: [{ url: '/images/products/sony-wh-1000xm5-1.jpg', alt: 'Sony WH-1000XM5', position: 0, isMain: true }],
      variants: [
        { name: 'Preto', sku: 'SNY-WH1000XM5-PRT', options: { cor: 'Preto' }, stock: 35, price: 2299.00 },
        { name: 'Prata', sku: 'SNY-WH1000XM5-PRA', options: { cor: 'Prata' }, stock: 35, price: 2299.00 },
      ],
    },
    {
      name: 'Sony WF-1000XM5',
      slug: 'sony-wf-1000xm5',
      description: 'Fones TWS ultra compactos com ANC líder mundial e LDAC.',
      shortDescription: 'ANC Top, LDAC Hi-Res, Ultra Compacto',
      price: 1899.00,
      stock: 80,
      sku: 'SNY-WF1000XM5-BLK',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.059,
      categorySlug: 'audio',
      brandSlug: 'sony',
      images: [{ url: '/images/products/sony-wf-1000xm5-1.jpg', alt: 'Sony WF-1000XM5', position: 0, isMain: true }],
    },
    {
      name: 'PlayStation 5 Slim',
      slug: 'playstation-5-slim',
      description: 'Console de nova geração 30% menor com SSD de 1TB.',
      shortDescription: '30% menor, 1TB SSD, 4K/120fps',
      price: 4499.00,
      stock: 50,
      sku: 'SNY-PS5S-1TB',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 3.200,
      categorySlug: 'games',
      brandSlug: 'sony',
      images: [{ url: '/images/products/playstation-5-slim-1.jpg', alt: 'PlayStation 5 Slim', position: 0, isMain: true }],
      variants: [
        { name: 'Standard Edition', sku: 'SNY-PS5S-STD', options: { versao: 'Standard (Disco)' }, stock: 30, price: 4499.00 },
        { name: 'Digital Edition', sku: 'SNY-PS5S-DIG', options: { versao: 'Digital' }, stock: 20, price: 3999.00 },
      ],
    },
    {
      name: 'Sony DualSense Edge',
      slug: 'sony-dualsense-edge',
      description: 'Controle pro para PS5 com sticks intercambiáveis.',
      shortDescription: 'Pro Controller, Customizável',
      price: 1299.00,
      stock: 40,
      sku: 'SNY-DSE-WHT',
      isActive: true,
      isFeatured: true,
      weight: 0.332,
      categorySlug: 'games',
      brandSlug: 'sony',
      images: [{ url: '/images/products/dualsense-edge-1.jpg', alt: 'DualSense Edge', position: 0, isMain: true }],
    },
    // BOSE PRODUCTS
    {
      name: 'Bose QuietComfort Ultra Headphones',
      slug: 'bose-quietcomfort-ultra',
      description: 'Fones over-ear com o melhor ANC Bose e Immersive Audio.',
      shortDescription: 'ANC Top Bose, Immersive Audio, 24h',
      price: 2899.00,
      stock: 45,
      sku: 'BOSE-QCUH-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.252,
      categorySlug: 'audio',
      brandSlug: 'bose',
      images: [{ url: '/images/products/bose-qc-ultra-1.jpg', alt: 'Bose QuietComfort Ultra', position: 0, isMain: true }],
      variants: [
        { name: 'Black', sku: 'BOSE-QCUH-BLK', options: { cor: 'Black' }, stock: 20, price: 2899.00 },
        { name: 'White Smoke', sku: 'BOSE-QCUH-WS', options: { cor: 'White Smoke' }, stock: 25, price: 2899.00 },
      ],
    },
    {
      name: 'Bose SoundLink Flex',
      slug: 'bose-soundlink-flex',
      description: 'Caixa portátil robusta com PositionIQ e IP67.',
      shortDescription: 'PositionIQ, IP67, Flutua, 12h',
      price: 899.00,
      stock: 80,
      sku: 'BOSE-SLF-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.588,
      categorySlug: 'audio',
      brandSlug: 'bose',
      images: [{ url: '/images/products/bose-soundlink-flex-1.jpg', alt: 'Bose SoundLink Flex', position: 0, isMain: true }],
    },
    // GOPRO PRODUCTS
    {
      name: 'GoPro HERO12 Black',
      slug: 'gopro-hero-12',
      description: 'Câmera de ação com 5.3K/60fps e HyperSmooth 6.0.',
      shortDescription: '5.3K/60fps, HyperSmooth 6.0, HDR',
      price: 2799.00,
      comparePrice: 2999.00,
      stock: 45,
      sku: 'GP-HERO12-BLK',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.154,
      categorySlug: 'cameras',
      brandSlug: 'gopro',
      images: [{ url: '/images/products/gopro-hero-12-1.jpg', alt: 'GoPro HERO12 Black', position: 0, isMain: true }],
      variants: [
        { name: 'Câmera', sku: 'GP-HERO12-CAM', options: { kit: 'Câmera' }, stock: 25, price: 2799.00 },
        { name: 'Creator Edition', sku: 'GP-HERO12-CE', options: { kit: 'Creator Edition' }, stock: 20, price: 3999.00 },
      ],
    },
    // NINTENDO PRODUCTS
    {
      name: 'Nintendo Switch OLED',
      slug: 'nintendo-switch-oled',
      description: 'Console híbrido com tela OLED de 7" e 64GB.',
      shortDescription: 'Tela OLED 7", 64GB, Dock LAN',
      price: 2499.00,
      stock: 60,
      sku: 'NTD-SWOLED-WHT',
      isActive: true,
      isFeatured: true,
      weight: 0.420,
      categorySlug: 'games',
      brandSlug: 'nintendo',
      images: [{ url: '/images/products/nintendo-switch-oled-1.jpg', alt: 'Nintendo Switch OLED', position: 0, isMain: true }],
      variants: [
        { name: 'Branco', sku: 'NTD-SWOLED-WHT', options: { cor: 'Branco' }, stock: 30, price: 2499.00 },
        { name: 'Neon', sku: 'NTD-SWOLED-NEO', options: { cor: 'Neon Azul/Vermelho' }, stock: 30, price: 2499.00 },
      ],
    },
    {
      name: 'Nintendo Switch Lite',
      slug: 'nintendo-switch-lite',
      description: 'Console portátil compacto com até 7h de bateria.',
      shortDescription: 'Portátil, 5.5", Até 7h bateria',
      price: 1499.00,
      stock: 80,
      sku: 'NTD-SWLITE-CRL',
      isActive: true,
      weight: 0.275,
      categorySlug: 'games',
      brandSlug: 'nintendo',
      images: [{ url: '/images/products/nintendo-switch-lite-1.jpg', alt: 'Nintendo Switch Lite', position: 0, isMain: true }],
      variants: [
        { name: 'Coral', sku: 'NTD-SWLITE-CRL', options: { cor: 'Coral' }, stock: 30, price: 1499.00 },
        { name: 'Turquesa', sku: 'NTD-SWLITE-TRQ', options: { cor: 'Turquesa' }, stock: 25, price: 1499.00 },
        { name: 'Amarelo', sku: 'NTD-SWLITE-AMR', options: { cor: 'Amarelo' }, stock: 25, price: 1499.00 },
      ],
    },
    // GOOGLE PRODUCTS
    {
      name: 'Google Pixel 8 Pro',
      slug: 'google-pixel-8-pro',
      description: 'Pixel com Tensor G3 e recursos exclusivos de IA.',
      shortDescription: 'Tensor G3, AI Features, 50MP Pro',
      price: 6499.00,
      comparePrice: 6999.00,
      stock: 35,
      sku: 'GGL-P8P-128',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.213,
      categorySlug: 'smartphones',
      brandSlug: 'google',
      images: [{ url: '/images/products/google-pixel-8-pro-1.jpg', alt: 'Google Pixel 8 Pro', position: 0, isMain: true }],
      variants: [
        { name: 'Obsidian 128GB', sku: 'GGL-P8P-OBS128', options: { cor: 'Obsidian', armazenamento: '128GB' }, stock: 20, price: 6499.00 },
        { name: 'Porcelain 256GB', sku: 'GGL-P8P-PRC256', options: { cor: 'Porcelain', armazenamento: '256GB' }, stock: 15, price: 6999.00 },
      ],
    },
    {
      name: 'Google Nest Hub 2ª Geração',
      slug: 'google-nest-hub-2',
      description: 'Smart display com Sleep Sensing e Google Assistant.',
      shortDescription: '7" Display, Sleep Sensing, Smart Home',
      price: 699.00,
      stock: 100,
      sku: 'GGL-NESTHUB2-CHR',
      isActive: true,
      weight: 0.558,
      categorySlug: 'casa-inteligente',
      brandSlug: 'google',
      images: [{ url: '/images/products/google-nest-hub-2-1.jpg', alt: 'Google Nest Hub 2', position: 0, isMain: true }],
    },
    // LOGITECH PRODUCTS
    {
      name: 'Logitech MX Master 3S',
      slug: 'logitech-mx-master-3s',
      description: 'Mouse premium com sensor 8K DPI e MagSpeed scroll.',
      shortDescription: '8K DPI, Quiet Clicks, MagSpeed, Flow',
      price: 599.00,
      stock: 100,
      sku: 'LOG-MXM3S-GRF',
      isActive: true,
      isFeatured: true,
      weight: 0.141,
      categorySlug: 'informatica',
      brandSlug: 'logitech',
      images: [{ url: '/images/products/logitech-mx-master-3s-1.jpg', alt: 'Logitech MX Master 3S', position: 0, isMain: true }],
      variants: [
        { name: 'Graphite', sku: 'LOG-MXM3S-GRF', options: { cor: 'Graphite' }, stock: 50, price: 599.00 },
        { name: 'Pale Gray', sku: 'LOG-MXM3S-PLG', options: { cor: 'Pale Gray' }, stock: 50, price: 599.00 },
      ],
    },
    {
      name: 'Logitech MX Keys S',
      slug: 'logitech-mx-keys-s',
      description: 'Teclado premium com Perfect Stroke e Smart Actions.',
      shortDescription: 'Perfect Stroke, Smart Actions, Flow',
      price: 699.00,
      stock: 80,
      sku: 'LOG-MXKS-GRF',
      isActive: true,
      isFeatured: true,
      weight: 0.506,
      categorySlug: 'informatica',
      brandSlug: 'logitech',
      images: [{ url: '/images/products/logitech-mx-keys-s-1.jpg', alt: 'Logitech MX Keys S', position: 0, isMain: true }],
    },
    {
      name: 'Logitech G PRO X SUPERLIGHT 2',
      slug: 'logitech-g-pro-x-superlight-2',
      description: 'Mouse gamer ultra-leve de 60g com 32K DPI.',
      shortDescription: '60g, 32K DPI, LIGHTSPEED, 95h',
      price: 999.00,
      stock: 60,
      sku: 'LOG-GPXSL2-BLK',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.060,
      categorySlug: 'informatica',
      brandSlug: 'logitech',
      images: [{ url: '/images/products/logitech-gpx-superlight-2-1.jpg', alt: 'Logitech G PRO X SUPERLIGHT 2', position: 0, isMain: true }],
    },
    // ANKER PRODUCTS
    {
      name: 'Anker PowerCore 24K',
      slug: 'anker-powercore-24k',
      description: 'Power bank 24000mAh com 140W para laptops.',
      shortDescription: '24000mAh, 140W, Carrega Laptops',
      price: 599.00,
      stock: 120,
      sku: 'ANK-PC24K-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.500,
      categorySlug: 'acessorios',
      brandSlug: 'anker',
      images: [{ url: '/images/products/anker-powercore-24k-1.jpg', alt: 'Anker PowerCore 24K', position: 0, isMain: true }],
    },
    {
      name: 'Anker Nano II 65W',
      slug: 'anker-nano-ii-65w',
      description: 'Carregador GaN compacto de 65W para laptops.',
      shortDescription: '65W GaN, Ultra Compacto, Laptops',
      price: 299.00,
      stock: 200,
      sku: 'ANK-NANO2-65W',
      isActive: true,
      isFeatured: true,
      weight: 0.112,
      categorySlug: 'acessorios',
      brandSlug: 'anker',
      images: [{ url: '/images/products/anker-nano-ii-65w-1.jpg', alt: 'Anker Nano II 65W', position: 0, isMain: true }],
    },
    {
      name: 'Anker Soundcore Liberty 4',
      slug: 'anker-soundcore-liberty-4',
      description: 'Fones TWS Hi-Fi com ANC e Áudio 360°.',
      shortDescription: 'ACAA 3.0 Hi-Fi, ANC, Áudio 360°',
      price: 699.00,
      comparePrice: 799.00,
      stock: 90,
      sku: 'ANK-SCL4-MBL',
      isActive: true,
      isFeatured: true,
      weight: 0.055,
      categorySlug: 'audio',
      brandSlug: 'anker',
      images: [{ url: '/images/products/anker-soundcore-liberty-4-1.jpg', alt: 'Anker Soundcore Liberty 4', position: 0, isMain: true }],
    },
    // WAVEPRO PRODUCTS (Marca Exclusiva)
    {
      name: 'WavePro Bass Elite',
      slug: 'wavepro-bass-elite',
      description: 'Fone bluetooth over-ear premium com graves profundos e ANC híbrido.',
      shortDescription: 'ANC Híbrido, 60h bateria, Graves Premium',
      price: 449.00,
      comparePrice: 549.00,
      stock: 150,
      sku: 'WP-BASSELT-BLK',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.280,
      categorySlug: 'audio',
      brandSlug: 'wavepro',
      images: [{ url: '/images/products/wavepro-bass-elite-1.jpg', alt: 'WavePro Bass Elite', position: 0, isMain: true }],
      variants: [
        { name: 'Black/Yellow', sku: 'WP-BE-BLKYLW', options: { cor: 'Black/Yellow' }, stock: 75, price: 449.00 },
        { name: 'Black', sku: 'WP-BE-BLK', options: { cor: 'Black' }, stock: 75, price: 449.00 },
      ],
    },
    {
      name: 'WavePro SoundStorm X1',
      slug: 'wavepro-soundstorm-x1',
      description: 'Caixa bluetooth com som 360° e LED sincronizado.',
      shortDescription: 'Som 360°, IPX7, 24h, LED Sync',
      price: 349.00,
      stock: 200,
      sku: 'WP-SSX1-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.680,
      categorySlug: 'audio',
      brandSlug: 'wavepro',
      images: [{ url: '/images/products/wavepro-soundstorm-x1-1.jpg', alt: 'WavePro SoundStorm X1', position: 0, isMain: true }],
      variants: [
        { name: 'Black/Yellow', sku: 'WP-SSX1-BLKYLW', options: { cor: 'Black/Yellow' }, stock: 100, price: 349.00 },
        { name: 'Black', sku: 'WP-SSX1-BLK', options: { cor: 'Black' }, stock: 100, price: 349.00 },
      ],
    },
    {
      name: 'WavePro Pro Buds',
      slug: 'wavepro-pro-buds',
      description: 'Fones TWS com ANC híbrido e driver de grafeno.',
      shortDescription: 'ANC Híbrido, Grafeno, 36h, Gaming',
      price: 299.00,
      comparePrice: 349.00,
      stock: 250,
      sku: 'WP-PBUDS-BLK',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.048,
      categorySlug: 'audio',
      brandSlug: 'wavepro',
      images: [{ url: '/images/products/wavepro-pro-buds-1.jpg', alt: 'WavePro Pro Buds', position: 0, isMain: true }],
      variants: [
        { name: 'Black/Yellow', sku: 'WP-PB-BLKYLW', options: { cor: 'Black/Yellow' }, stock: 125, price: 299.00 },
        { name: 'Black', sku: 'WP-PB-BLK', options: { cor: 'Black' }, stock: 125, price: 299.00 },
      ],
    },
    {
      name: 'WavePro Power Station 20K',
      slug: 'wavepro-power-station-20k',
      description: 'Power bank 20000mAh com carregamento rápido 65W PD.',
      shortDescription: '20000mAh, 65W PD, Cabo Integrado',
      price: 249.00,
      stock: 180,
      sku: 'WP-PS20K-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.420,
      categorySlug: 'acessorios',
      brandSlug: 'wavepro',
      images: [{ url: '/images/products/wavepro-power-station-20k-1.jpg', alt: 'WavePro Power Station 20K', position: 0, isMain: true }],
    },
    {
      name: 'WavePro Turbo Charger 100W',
      slug: 'wavepro-turbo-charger-100w',
      description: 'Carregador GaN de 100W com 3 portas.',
      shortDescription: '100W GaN, 3 Portas, Laptops',
      price: 199.00,
      stock: 200,
      sku: 'WP-TC100W-BLK',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.180,
      categorySlug: 'acessorios',
      brandSlug: 'wavepro',
      images: [{ url: '/images/products/wavepro-turbo-charger-100w-1.jpg', alt: 'WavePro Turbo Charger 100W', position: 0, isMain: true }],
    },
    {
      name: 'WavePro SmartBand Fit',
      slug: 'wavepro-smartband-fit',
      description: 'Smartband com AMOLED, SpO2 e 14 dias de bateria.',
      shortDescription: 'AMOLED, SpO2, 100+ Esportes, 14 dias',
      price: 199.00,
      stock: 200,
      sku: 'WP-SBFIT-BLK',
      isActive: true,
      isFeatured: true,
      weight: 0.026,
      categorySlug: 'smartwatch',
      brandSlug: 'wavepro',
      images: [{ url: '/images/products/wavepro-smartband-fit-1.jpg', alt: 'WavePro SmartBand Fit', position: 0, isMain: true }],
    },
    {
      name: 'WavePro USB Hub Pro',
      slug: 'wavepro-usb-hub-pro',
      description: 'Hub USB-C 7-em-1 com HDMI 4K e PD 100W.',
      shortDescription: '7-em-1, HDMI 4K, PD 100W',
      price: 179.00,
      stock: 150,
      sku: 'WP-HUBPRO-GRY',
      isActive: true,
      isFeatured: true,
      weight: 0.065,
      categorySlug: 'informatica',
      brandSlug: 'wavepro',
      images: [{ url: '/images/products/wavepro-usb-hub-pro-1.jpg', alt: 'WavePro USB Hub Pro', position: 0, isMain: true }],
    },
    // ACCESSORIES
    {
      name: 'Apple Pencil Pro',
      slug: 'apple-pencil-pro',
      description: 'Apple Pencil mais avançada com Squeeze e Find My.',
      shortDescription: 'Squeeze, Haptic, Find My, Barrel Roll',
      price: 999.00,
      stock: 80,
      sku: 'APL-APCL-PRO',
      isActive: true,
      isFeatured: true,
      isNew: true,
      weight: 0.021,
      categorySlug: 'acessorios',
      brandSlug: 'apple',
      images: [{ url: '/images/products/apple-pencil-pro-1.jpg', alt: 'Apple Pencil Pro', position: 0, isMain: true }],
    },
    {
      name: 'Apple MagSafe Charger',
      slug: 'magsafe-charger',
      description: 'Carregador sem fio magnético de 15W.',
      shortDescription: 'Magnético, 15W, iPhone & AirPods',
      price: 349.00,
      stock: 150,
      sku: 'APL-MAGSAFE-1M',
      isActive: true,
      weight: 0.055,
      categorySlug: 'acessorios',
      brandSlug: 'apple',
      images: [{ url: '/images/products/magsafe-charger-1.jpg', alt: 'MagSafe Charger', position: 0, isMain: true }],
    },
    {
      name: 'Samsung 45W Super Fast Charger',
      slug: 'samsung-45w-charger',
      description: 'Carregador rápido de 45W para Galaxy.',
      shortDescription: '45W, Super Fast, PPS',
      price: 199.00,
      stock: 200,
      sku: 'SAM-45W-CHG',
      isActive: true,
      weight: 0.082,
      categorySlug: 'acessorios',
      brandSlug: 'samsung',
      images: [{ url: '/images/products/samsung-45w-charger-1.jpg', alt: 'Samsung 45W Charger', position: 0, isMain: true }],
    },
  ];

  // Create products sequentially to avoid connection pool issues
  const products: any[] = [];
  for (const productData of productsData) {
    const { categorySlug, brandSlug, images, variants, ...data } = productData;
    
    // Gerar salesCount aleatório (0-500, favorecendo featured)
    const salesCount = data.isFeatured 
      ? Math.floor(Math.random() * 300) + 200  // 200-500 para featured
      : Math.floor(Math.random() * 200);        // 0-200 para outros
    
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: { salesCount },
      create: {
        ...data,
        salesCount,
        categoryId: categories[categorySlug].id,
        brandId: brands[brandSlug].id,
        images: images ? { create: images } : undefined,
        variants: variants ? { create: variants } : undefined,
      },
    });
    products.push(product);
    
    // Progress indicator
    if (products.length % 10 === 0) {
      console.log(`   Created ${products.length}/${productsData.length} products...`);
    }
  }
  console.log('✅ Products created:', products.length);

  // Create sample address
  await prisma.address.upsert({
    where: { id: 'sample-address-1' },
    update: {},
    create: {
      id: 'sample-address-1',
      userId: customer.id,
      label: 'Casa',
      recipientName: 'João Silva',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: true,
    },
  });
  console.log('✅ Sample address created');

  // ==================== CMS DATA ====================
  console.log('📝 Creating CMS data...');

  // Hero Slides
  const heroSlidesData = [
    {
      title: 'WavePro Películas Premium',
      subtitle: 'Proteção Profissional',
      description: 'A melhor proteção para seu smartphone com tecnologia de ponta e instalação profissional.',
      imageUrl: '/images/hero/wavepro-hero.jpg',
      mobileImageUrl: '/images/hero/wavepro-hero-mobile.jpg',
      ctaText: 'Conhecer WavePro',
      ctaLink: '/wavepro',
      order: 1,
      isActive: true,
    },
    {
      title: 'iPhone 15 Pro Max',
      subtitle: 'Agora Disponível',
      description: 'O smartphone mais poderoso da Apple. Chip A17 Pro, câmera de 48MP e acabamento em titânio.',
      imageUrl: '/images/hero/iphone-15-hero.jpg',
      mobileImageUrl: '/images/hero/iphone-15-hero-mobile.jpg',
      ctaText: 'Ver Produtos',
      ctaLink: '/products?brand=apple',
      order: 2,
      isActive: true,
    },
    {
      title: 'Galaxy S24 Ultra',
      subtitle: 'Inteligência Galaxy AI',
      description: 'Recursos de IA revolucionários, câmera de 200MP e S Pen integrada.',
      imageUrl: '/images/hero/galaxy-s24-hero.jpg',
      mobileImageUrl: '/images/hero/galaxy-s24-hero-mobile.jpg',
      ctaText: 'Explorar',
      ctaLink: '/products?brand=samsung',
      order: 3,
      isActive: true,
    },
    {
      title: 'Frete Grátis',
      subtitle: 'Acima de R$ 199',
      description: 'Compras acima de R$ 199 têm frete grátis para todo o Brasil. Aproveite!',
      imageUrl: '/images/hero/frete-gratis-hero.jpg',
      mobileImageUrl: '/images/hero/frete-gratis-hero-mobile.jpg',
      ctaText: 'Comprar Agora',
      ctaLink: '/products',
      order: 4,
      isActive: true,
    },
  ];

  for (const slide of heroSlidesData) {
    await prisma.heroSlide.upsert({
      where: { id: `hero-${slide.order}` },
      update: slide,
      create: { id: `hero-${slide.order}`, ...slide },
    });
  }
  console.log('✅ Hero slides created:', heroSlidesData.length);

  // Banners
  const bannersData = [
    {
      title: 'Pix com 5% de desconto',
      imageUrl: '/images/banners/pix-desconto.jpg',
      mobileImageUrl: '/images/banners/pix-desconto-mobile.jpg',
      link: '/parcelamento',
      position: 'home-top',
      order: 1,
      isActive: true,
    },
    {
      title: 'Loja Física - Criciúma',
      imageUrl: '/images/banners/loja-criciuma.jpg',
      mobileImageUrl: '/images/banners/loja-criciuma-mobile.jpg',
      link: '/contato',
      position: 'home-middle',
      order: 1,
      isActive: true,
    },
    {
      title: 'WavePro - Películas Premium',
      imageUrl: '/images/banners/wavepro-banner.jpg',
      mobileImageUrl: '/images/banners/wavepro-banner-mobile.jpg',
      link: '/wavepro',
      position: 'home-middle',
      order: 2,
      isActive: true,
    },
    {
      title: 'Acessórios Apple Originais',
      imageUrl: '/images/banners/apple-acessorios.jpg',
      link: '/products?brand=apple&category=acessorios',
      position: 'sidebar',
      order: 1,
      isActive: true,
    },
  ];

  for (let i = 0; i < bannersData.length; i++) {
    const banner = bannersData[i];
    await prisma.banner.upsert({
      where: { id: `banner-${i + 1}` },
      update: banner,
      create: { id: `banner-${i + 1}`, ...banner },
    });
  }
  console.log('✅ Banners created:', bannersData.length);

  // Testimonials
  const testimonialsData = [
    {
      name: 'Carlos Eduardo',
      role: 'Cliente',
      company: null,
      content: 'Comprei meu iPhone na USS Brasil e a experiência foi incrível! Atendimento excelente, produto original com nota fiscal e ainda ganhei brinde. Recomendo demais!',
      rating: 5,
      avatarUrl: '/images/testimonials/carlos.jpg',
      isActive: true,
    },
    {
      name: 'Maria Fernanda',
      role: 'Empresária',
      company: 'Tech Solutions',
      content: 'Trabalho com revenda de eletrônicos e a USS Brasil é minha fornecedora principal. Preços competitivos, produtos originais e entrega sempre no prazo.',
      rating: 5,
      avatarUrl: '/images/testimonials/maria.jpg',
      isActive: true,
    },
    {
      name: 'João Ricardo',
      role: 'Cliente',
      company: null,
      content: 'A película WavePro é simplesmente a melhor que já usei! Proteção total e não atrapalha em nada a sensibilidade da tela. Vale cada centavo.',
      rating: 5,
      avatarUrl: '/images/testimonials/joao.jpg',
      isActive: true,
    },
    {
      name: 'Ana Paula',
      role: 'Designer',
      company: 'Studio AP',
      content: 'Já comprei vários produtos na loja física e online. O atendimento é sempre impecável e os funcionários entendem muito de tecnologia.',
      rating: 5,
      avatarUrl: '/images/testimonials/ana.jpg',
      isActive: true,
    },
    {
      name: 'Pedro Henrique',
      role: 'Revendedor',
      company: 'PH Imports',
      content: 'Sou revendedor parceiro há 3 anos. A USS Brasil sempre tem os lançamentos primeiro e o suporte pós-venda é excepcional.',
      rating: 5,
      avatarUrl: '/images/testimonials/pedro.jpg',
      isActive: true,
    },
    {
      name: 'Juliana Costa',
      role: 'Cliente',
      company: null,
      content: 'Comprei um Galaxy S24 pelo site e chegou super rápido! Embalagem impecável e produto lacrado. Já virei cliente fiel!',
      rating: 5,
      avatarUrl: '/images/testimonials/juliana.jpg',
      isActive: true,
    },
  ];

  for (let i = 0; i < testimonialsData.length; i++) {
    const testimonial = testimonialsData[i];
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${i + 1}` },
      update: testimonial,
      create: { id: `testimonial-${i + 1}`, ...testimonial },
    });
  }
  console.log('✅ Testimonials created:', testimonialsData.length);

  // Home Sections
  const homeSectionsData = [
    {
      type: 'featured-products',
      title: 'Produtos em Destaque',
      subtitle: 'Os mais vendidos da semana',
      order: 1,
      isActive: true,
      config: { limit: 8, showPrice: true, showRating: true },
    },
    {
      type: 'categories',
      title: 'Navegue por Categoria',
      subtitle: 'Encontre exatamente o que você procura',
      order: 2,
      isActive: true,
      config: { layout: 'grid', showCount: true },
    },
    {
      type: 'brands',
      title: 'Marcas Parceiras',
      subtitle: 'Trabalhamos apenas com as melhores marcas',
      order: 3,
      isActive: true,
      config: { layout: 'carousel', showLogo: true },
    },
    {
      type: 'new-arrivals',
      title: 'Novidades',
      subtitle: 'Acabaram de chegar',
      order: 4,
      isActive: true,
      config: { limit: 6, daysRecent: 30 },
    },
    {
      type: 'testimonials',
      title: 'O que nossos clientes dizem',
      subtitle: 'Mais de 50.000 clientes satisfeitos',
      order: 5,
      isActive: true,
      config: { layout: 'carousel', autoplay: true },
    },
    {
      type: 'features',
      title: 'Por que escolher a USS Brasil?',
      subtitle: 'Benefícios exclusivos para você',
      order: 6,
      isActive: true,
      config: { layout: 'grid' },
    },
  ];

  for (let i = 0; i < homeSectionsData.length; i++) {
    const section = homeSectionsData[i];
    await prisma.homeSection.upsert({
      where: { id: `section-${i + 1}` },
      update: section,
      create: { id: `section-${i + 1}`, ...section },
    });
  }
  console.log('✅ Home sections created:', homeSectionsData.length);

  // Page Contents
  const pageContentsData = [
    {
      slug: 'about',
      title: 'Sobre a USS Brasil',
      content: `
# Sobre a USS Brasil

## Nossa História

A **USS Brasil** nasceu em 2008 em Criciúma, Santa Catarina, com um sonho: democratizar o acesso à tecnologia de qualidade no sul do Brasil.

Começamos como uma pequena loja de 30m² na Praça Nereu Ramos, vendendo acessórios para celular. Com dedicação, honestidade e foco no cliente, crescemos e hoje somos referência em tecnologia e acessórios premium em toda a região.

## Nossa Missão

Proporcionar aos nossos clientes a melhor experiência em tecnologia, oferecendo produtos de qualidade, preços justos e atendimento humanizado.

## Nossa Visão

Ser a maior e mais confiável empresa de tecnologia do sul do Brasil, reconhecida pela excelência em atendimento e qualidade dos produtos.

## Nossos Valores

- **Qualidade**: Trabalhamos apenas com produtos originais e homologados
- **Honestidade**: Transparência em todas as negociações
- **Inovação**: Sempre buscando as últimas tendências do mercado
- **Atendimento**: Cliente em primeiro lugar, sempre

## A Marca WavePro

Em 2016, lançamos a **WavePro**, nossa marca exclusiva de películas premium. Desenvolvida com a mais alta tecnologia, a WavePro oferece proteção superior para smartphones e tablets.

## Números que nos orgulham

- **15+ anos** de mercado
- **50.000+** clientes atendidos
- **10.000+** produtos vendidos mensalmente
- **4.9** de avaliação média

## Nossas Lojas

Visite uma de nossas lojas em Criciúma:

**Loja Centro**
Praça Nereu Ramos, 364 - Centro
CEP 88801-505

**Loja Marechal**
Rua Marechal Deodoro, 195
CEP 88801-110
      `.trim(),
      metaTitle: 'Sobre Nós | USS Brasil - Tecnologia de Qualidade',
      metaDescription: 'Conheça a história da USS Brasil, referência em tecnologia e acessórios premium desde 2008 em Criciúma/SC.',
      isPublished: true,
    },
    {
      slug: 'faq',
      title: 'Perguntas Frequentes',
      content: `
# Perguntas Frequentes (FAQ)

## Pedidos e Compras

### Como faço uma compra no site?
Navegue pelos produtos, adicione ao carrinho e finalize com cadastro. Aceitamos cartão, PIX e boleto.

### Posso alterar meu pedido após a confirmação?
Alterações são possíveis apenas antes do envio. Entre em contato imediatamente pelo WhatsApp.

### Como acompanho meu pedido?
Após o envio, você receberá um código de rastreio por e-mail. Acompanhe em tempo real.

## Pagamentos

### Quais formas de pagamento são aceitas?
- Cartão de crédito (até 12x sem juros)
- PIX (5% de desconto)
- Boleto bancário

### O pagamento é seguro?
Sim! Utilizamos criptografia SSL e processamos pagamentos via Stripe, líder mundial em segurança.

### Quando meu cartão será cobrado?
A cobrança é feita no momento da aprovação do pedido.

## Entregas

### Qual o prazo de entrega?
O prazo varia de 2 a 15 dias úteis, dependendo da região. Calcule no carrinho com seu CEP.

### O frete é grátis?
Frete grátis para compras acima de R$ 199 em todo o Brasil.

### Vocês entregam em todo o Brasil?
Sim! Entregamos em todas as regiões do país via Correios e transportadoras.

## Trocas e Devoluções

### Qual o prazo para troca ou devolução?
7 dias para devolução (direito de arrependimento) e 30 dias para troca por defeito.

### Como solicito uma troca?
Entre em contato conosco informando o número do pedido e o motivo da troca.

### Quem paga o frete da troca?
Em caso de defeito, nós pagamos. Para arrependimento, o frete é por conta do cliente.

## Garantia

### Qual a garantia dos produtos?
Todos os produtos têm garantia de fábrica. O prazo varia conforme o fabricante.

### Como aciono a garantia?
Entre em contato conosco com nota fiscal e fotos/vídeos do problema.

## Loja Física

### Vocês têm loja física?
Sim! Temos duas lojas em Criciúma/SC. Venha nos visitar!

### Posso retirar na loja?
Sim! Escolha "Retirar na loja" no checkout e retire em até 24h após confirmação.
      `.trim(),
      metaTitle: 'FAQ - Perguntas Frequentes | USS Brasil',
      metaDescription: 'Tire suas dúvidas sobre compras, pagamentos, entregas, trocas e garantia na USS Brasil.',
      isPublished: true,
    },
    {
      slug: 'como-comprar',
      title: 'Como Comprar',
      content: `
# Como Comprar na USS Brasil

Comprar na USS Brasil é fácil, rápido e seguro! Siga o passo a passo:

## 1. Escolha seus Produtos

Navegue pelo site usando o menu de categorias ou a barra de busca. Clique no produto para ver detalhes.

## 2. Adicione ao Carrinho

Escolha a variação desejada (cor, tamanho, etc.) e clique em "Adicionar ao Carrinho".

## 3. Revise seu Carrinho

Clique no ícone do carrinho para revisar os itens. Você pode alterar quantidades ou remover produtos.

## 4. Calcule o Frete

Digite seu CEP para ver as opções de entrega e prazos. Compras acima de R$ 199 têm frete grátis!

## 5. Faça Login ou Cadastre-se

Se já tem conta, faça login. Se não, cadastre-se rapidamente com seus dados.

## 6. Endereço de Entrega

Confirme ou cadastre o endereço de entrega. Confira se está tudo correto!

## 7. Escolha a Forma de Pagamento

- **Cartão**: Até 12x sem juros
- **PIX**: 5% de desconto, aprovação imediata
- **Boleto**: Vence em 3 dias úteis

## 8. Confirme e Finalize

Revise todos os dados e clique em "Finalizar Compra". Pronto!

## 9. Acompanhe seu Pedido

Você receberá e-mails de confirmação e código de rastreio. Acompanhe pela área "Meus Pedidos".

---

**Dúvidas?** Entre em contato pelo WhatsApp: (48) 99196-9371
      `.trim(),
      metaTitle: 'Como Comprar | USS Brasil',
      metaDescription: 'Aprenda como comprar na USS Brasil de forma fácil e segura. Passo a passo completo.',
      isPublished: true,
    },
  ];

  for (const page of pageContentsData) {
    await prisma.pageContent.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
  console.log('✅ Page contents created:', pageContentsData.length);

  // Site Config
  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      logoUrl: '/images/logo-ussbrasil.png',
      logoWhiteUrl: '/images/logo-ussbrasil-white.png',
      faviconUrl: '/favicon.ico',
      primaryColor: '#EAB308', // Yellow-500
      secondaryColor: '#1E40AF', // Blue-800
      accentColor: '#22C55E', // Green-500
      heroTitle: 'USS Brasil - Tecnologia de Qualidade',
      heroSubtitle: 'Mais de 15 anos oferecendo os melhores produtos em tecnologia',
      footerText: '© 2024 USS Brasil. Todos os direitos reservados. CNPJ: XX.XXX.XXX/0001-XX',
      socialFacebook: 'https://facebook.com/ussbrasil',
      socialInstagram: 'https://instagram.com/comercialussbrasil',
      socialTwitter: null,
      socialLinkedin: null,
      socialYoutube: 'https://youtube.com/@ussbrasil',
      whatsappNumber: '5548991969371',
    },
  });
  console.log('✅ Site config created');

  // ==================== BLOG POSTS ====================
  console.log('📝 Creating blog posts...');

  const blogPostsData = [
    {
      title: 'iPhone 16: Tudo o que você precisa saber sobre o lançamento',
      slug: 'iphone-16-tudo-sobre-lancamento',
      excerpt: 'Confira todas as novidades, especificações técnicas e preços do novo iPhone 16 e iPhone 16 Pro. O chip A18 promete revolucionar o mercado.',
      content: `
O novo iPhone 16 chegou e traz uma série de inovações que prometem revolucionar a forma como usamos nossos smartphones. Neste artigo, vamos explorar todas as novidades do dispositivo mais aguardado do ano.

## Design e Construção

O iPhone 16 mantém a tradição de design premium da Apple, agora com bordas ainda mais finas e um novo botão de ação personalizável. O dispositivo está disponível nas cores:
- Preto Espacial
- Branco Estelar  
- Azul Oceano
- Rosa Quartzo
- Verde Oliva

## Chip A18 Pro

O coração do iPhone 16 é o novo chip A18 Pro, fabricado em processo de 3nm de segunda geração. Este processador oferece:
- 40% mais performance que o A17
- Eficiência energética superior
- Neural Engine com 35 trilhões de operações por segundo
- Suporte nativo a Apple Intelligence

## Câmeras

O sistema de câmeras foi completamente redesenhado:
- Câmera principal de 48MP com sensor maior
- Ultra wide de 48MP (nova!)
- Telefoto 5x (nos modelos Pro)
- Gravação de vídeo em ProRes Log

## Bateria e Carregamento

A bateria também recebeu melhorias significativas:
- Até 29 horas de reprodução de vídeo (Pro Max)
- Carregamento rápido de 45W com fio
- MagSafe de 25W

## Preços na USS Brasil

Já disponível para compra na USS Brasil com os melhores preços do mercado e parcelamento em até 12x sem juros!
      `.trim(),
      category: 'lancamentos',
      tags: ['iphone', 'apple', 'lancamento', 'smartphone'],
      authorName: 'Equipe USS Brasil',
      readTime: 8,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: 'Guia Completo: Como escolher a película ideal para seu smartphone',
      slug: 'como-escolher-pelicula-ideal-smartphone',
      excerpt: 'Descubra os diferentes tipos de película disponíveis no mercado e qual é a melhor opção para proteger a tela do seu celular.',
      content: `
Escolher a película certa para o seu smartphone pode parecer uma tarefa simples, mas existem várias opções no mercado que atendem a diferentes necessidades. Neste guia, vamos explicar cada tipo para você fazer a melhor escolha.

## Tipos de Película

### Vidro Temperado

A opção mais popular e com melhor custo-benefício:
- Dureza de 9H (resiste a chaves e moedas)
- Sensibilidade ao toque preservada
- Proteção contra quedas

**Recomendado para:** Uso geral, máxima proteção

### Película Hidrogel

Material flexível que se adapta a telas curvas:
- Autorreparação de pequenos arranhões
- Aplicação mais fácil
- Ótima transparência

**Recomendado para:** Telas curvas, Samsung Galaxy Edge

### Película Fosca

Ideal para quem usa muito o celular sob o sol:
- Reduz reflexos
- Textura agradável ao toque
- Proteção anti-impressão digital

**Recomendado para:** Gamers, uso externo

### Película de Privacidade

Impede que outras pessoas vejam sua tela:
- Visão bloqueada em ângulos laterais
- Proteção de dados sensíveis
- Vidro temperado incluído

**Recomendado para:** Profissionais, transporte público

## Linha WavePro

Nossa linha exclusiva WavePro oferece películas premium com:
- Garantia vitalícia de aplicação
- Kit de aplicação completo
- Tratamento oleofóbico avançado
- Borda 3D para proteção total

Visite nossa loja e conheça toda a linha!
      `.trim(),
      category: 'dicas',
      tags: ['pelicula', 'protecao', 'dicas', 'wavepro'],
      authorName: 'Equipe Técnica',
      readTime: 5,
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'WavePro: Conheça nossa linha exclusiva de películas premium',
      slug: 'wavepro-peliculas-premium',
      excerpt: 'Descubra por que a linha WavePro é a escolha dos profissionais e entusiastas que buscam a melhor proteção para seus dispositivos.',
      content: `
A WavePro é a marca própria da USS Brasil, desenvolvida para oferecer a melhor proteção possível para smartphones e tablets com preço justo e qualidade excepcional.

## Por que WavePro?

Após anos atendendo clientes e ouvindo suas necessidades, desenvolvemos uma linha completa que resolve os principais problemas das películas comuns:

### Durabilidade Superior
- Vidro temperado de alta qualidade importado
- Tratamento anti-risco profissional
- Resistência a quedas de até 1.5m

### Aplicação Perfeita
- Kit completo incluso (álcool, flanela, removedor de poeira)
- Guia de alinhamento para aplicação
- Garantia de troca se houver bolhas

### Toque Natural
- Tratamento oleofóbico de longa duração
- Sensibilidade 100% preservada
- Compatível com leitores de digital

## Produtos da Linha

### WavePro HD Clear
Nossa película mais vendida, ideal para uso diário com máxima clareza.

### WavePro Matte
Acabamento fosco para gamers e uso intensivo.

### WavePro Privacy
Proteção visual contra olhares indiscretos.

### WavePro Camera
Proteção específica para lentes de câmera.

## Onde Encontrar

Todas as películas WavePro estão disponíveis em nossas lojas físicas e no site. Oferecemos aplicação gratuita em qualquer loja!
      `.trim(),
      category: 'produtos',
      tags: ['wavepro', 'pelicula', 'premium', 'exclusivo'],
      authorName: 'Marketing USS Brasil',
      readTime: 4,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log('✅ Blog posts created:', blogPostsData.length);

  // ==================== PROMOTIONS ====================
  console.log('🏷️ Creating promotions...');

  const promotionsData = [
    {
      id: 'promo-1',
      title: 'Flash Sale',
      subtitle: 'Até 50% OFF',
      description: 'Películas WavePro com desconto especial. Proteção premium pelo menor preço!',
      discount: 50,
      link: '/products?brand=wavepro',
      color: 'from-red-500 to-orange-500',
      isActive: true,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      order: 0,
    },
    {
      id: 'promo-2',
      title: 'Combo iPhone',
      subtitle: 'Economize R$ 100',
      description: 'Capinha + Película + Carregador com super desconto. Aproveite!',
      discount: 30,
      link: '/products?category=acessorios&brand=apple',
      color: 'from-blue-500 to-cyan-500',
      isActive: true,
      order: 1,
    },
    {
      id: 'promo-3',
      title: 'Semana Samsung',
      subtitle: 'Acessórios Originais',
      description: 'Toda linha de acessórios Galaxy com preços especiais.',
      discount: 25,
      link: '/products?brand=samsung',
      color: 'from-purple-500 to-pink-500',
      isActive: true,
      order: 2,
    },
  ];

  for (const promo of promotionsData) {
    await prisma.promotion.upsert({
      where: { id: promo.id },
      update: promo,
      create: promo,
    });
  }
  console.log('✅ Promotions created:', promotionsData.length);

  // ==================== STORES ====================
  console.log('🏪 Creating stores...');

  const storesData = [
    {
      name: 'USS Brasil - Matriz Florianópolis',
      slug: 'florianopolis-centro',
      description: 'Nossa loja matriz com o maior estoque e equipe especializada.',
      address: 'Rua Felipe Schmidt, 515, Centro',
      city: 'Florianópolis',
      state: 'SC',
      zipCode: '88010-001',
      phone: '(48) 3025-1234',
      whatsapp: '5548999999999',
      email: 'floripa@ussbrasil.com.br',
      latitude: -27.5969,
      longitude: -48.5495,
      openingHours: {
        seg: '09:00-19:00',
        ter: '09:00-19:00',
        qua: '09:00-19:00',
        qui: '09:00-19:00',
        sex: '09:00-19:00',
        sab: '09:00-14:00',
        dom: 'Fechado',
      },
      isActive: true,
      isFlagship: true,
    },
    {
      name: 'USS Brasil - Shopping Iguatemi',
      slug: 'florianopolis-iguatemi',
      description: 'Localizada no Shopping Iguatemi Florianópolis.',
      address: 'Av. Madre Benvenuta, 687, Loja 234',
      city: 'Florianópolis',
      state: 'SC',
      zipCode: '88035-000',
      phone: '(48) 3025-5678',
      whatsapp: '5548999999998',
      email: 'iguatemi@ussbrasil.com.br',
      latitude: -27.5856,
      longitude: -48.5075,
      openingHours: {
        seg: '10:00-22:00',
        ter: '10:00-22:00',
        qua: '10:00-22:00',
        qui: '10:00-22:00',
        sex: '10:00-22:00',
        sab: '10:00-22:00',
        dom: '14:00-20:00',
      },
      isActive: true,
      isFlagship: false,
    },
    {
      name: 'USS Brasil - Joinville',
      slug: 'joinville-centro',
      description: 'Atendendo a região norte de Santa Catarina.',
      address: 'Rua 9 de Março, 820, Centro',
      city: 'Joinville',
      state: 'SC',
      zipCode: '89201-400',
      phone: '(47) 3025-9012',
      whatsapp: '5547999999999',
      email: 'joinville@ussbrasil.com.br',
      latitude: -26.3045,
      longitude: -48.8487,
      openingHours: {
        seg: '09:00-18:30',
        ter: '09:00-18:30',
        qua: '09:00-18:30',
        qui: '09:00-18:30',
        sex: '09:00-18:30',
        sab: '09:00-13:00',
        dom: 'Fechado',
      },
      isActive: true,
      isFlagship: false,
    },
  ];

  for (const store of storesData) {
    await prisma.store.upsert({
      where: { slug: store.slug },
      update: store,
      create: store,
    });
  }
  console.log('✅ Stores created:', storesData.length);

  // ==================== JOB OPENINGS ====================
  console.log('💼 Creating job openings...');

  const jobsData = [
    {
      title: 'Vendedor(a) de Loja',
      slug: 'vendedor-loja-florianopolis',
      department: 'vendas',
      location: 'Florianópolis, SC',
      type: 'clt',
      workMode: 'presencial',
      description: 'Buscamos vendedor(a) apaixonado(a) por tecnologia para atendimento ao cliente em nossa loja física. Você será responsável por apresentar produtos, esclarecer dúvidas e garantir a melhor experiência de compra.',
      requirements: `
- Ensino médio completo
- Experiência prévia em vendas (desejável)
- Conhecimento básico em smartphones e acessórios
- Boa comunicação e habilidade de negociação
- Disponibilidade para trabalhar em shopping (horário comercial)
      `.trim(),
      benefits: `
- Salário fixo + comissões atrativas
- Vale transporte
- Vale refeição
- Plano de saúde após 3 meses
- Desconto em produtos
- Oportunidade de crescimento
      `.trim(),
      salaryRange: 'R$ 1.800 - R$ 3.500',
      isNegotiable: true,
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Desenvolvedor(a) Full Stack',
      slug: 'desenvolvedor-fullstack',
      department: 'ti',
      location: 'Florianópolis, SC',
      type: 'pj',
      workMode: 'hibrido',
      description: 'Procuramos desenvolvedor(a) Full Stack para atuar no desenvolvimento e manutenção do nosso e-commerce e sistemas internos. Trabalhamos com tecnologias modernas e metodologias ágeis.',
      requirements: `
- Experiência com React/Next.js
- Experiência com Node.js/NestJS
- Conhecimento em TypeScript
- Familiaridade com bancos de dados SQL e NoSQL
- Experiência com Git
- Inglês técnico para leitura
      `.trim(),
      benefits: `
- Contrato PJ competitivo
- Modelo híbrido (2x presencial)
- Equipamento fornecido
- Ambiente descontraído
- Treinamentos e certificações
      `.trim(),
      salaryRange: 'R$ 8.000 - R$ 15.000',
      isNegotiable: true,
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Auxiliar de Logística',
      slug: 'auxiliar-logistica',
      department: 'logistica',
      location: 'Florianópolis, SC',
      type: 'clt',
      workMode: 'presencial',
      description: 'Vaga para auxiliar de logística no setor de expedição. Responsável por separação, conferência e embalagem de pedidos.',
      requirements: `
- Ensino médio completo
- Organização e atenção aos detalhes
- Agilidade e proatividade
- Disponibilidade para trabalhar de segunda a sexta
      `.trim(),
      benefits: `
- Salário compatível com o mercado
- Vale transporte
- Vale refeição
- Plano de saúde
      `.trim(),
      salaryRange: 'R$ 1.600 - R$ 2.200',
      isNegotiable: false,
      isActive: true,
      isFeatured: false,
    },
  ];

  for (const job of jobsData) {
    await prisma.jobOpening.upsert({
      where: { slug: job.slug },
      update: job,
      create: job,
    });
  }
  console.log('✅ Job openings created:', jobsData.length);

  // ==================== FAQ ====================
  console.log('❓ Creating FAQs...');

  const faqsData = [
    { question: 'Como rastrear meu pedido?', answer: 'Após a postagem, você receberá um código de rastreio por e-mail. Também pode acompanhar em "Meus Pedidos" no site.', category: 'envio', order: 1 },
    { question: 'Qual o prazo de entrega?', answer: 'O prazo varia de acordo com a região e transportadora escolhida. Em geral, de 3 a 10 dias úteis após postagem.', category: 'envio', order: 2 },
    { question: 'Quais formas de pagamento são aceitas?', answer: 'Aceitamos cartões de crédito (Visa, Master, Elo, Amex), PIX com 10% de desconto e boleto bancário.', category: 'pagamento', order: 1 },
    { question: 'Posso parcelar minha compra?', answer: 'Sim! Parcele em até 12x sem juros no cartão de crédito (parcela mínima de R$ 50).', category: 'pagamento', order: 2 },
    { question: 'Como funciona a troca ou devolução?', answer: 'Você tem 7 dias após o recebimento para solicitar troca ou devolução. O produto deve estar lacrado e sem uso.', category: 'trocas', order: 1 },
    { question: 'Os produtos têm garantia?', answer: 'Todos os produtos possuem garantia de fábrica que varia de 3 meses a 1 ano, dependendo do fabricante.', category: 'produtos', order: 1 },
    { question: 'Os produtos são originais?', answer: 'Sim! Trabalhamos apenas com produtos 100% originais e homologados pela Anatel quando aplicável.', category: 'produtos', order: 2 },
    { question: 'Como criar uma conta?', answer: 'Clique em "Entrar" no canto superior direito e depois em "Criar conta". Preencha seus dados e confirme o e-mail.', category: 'conta', order: 1 },
    { question: 'Esqueci minha senha, o que faço?', answer: 'Na tela de login, clique em "Esqueci minha senha". Você receberá um link para redefinição por e-mail.', category: 'conta', order: 2 },
    { question: 'Como aplicar um cupom de desconto?', answer: 'Na página de checkout, insira o código do cupom no campo "Cupom de desconto" e clique em "Aplicar".', category: 'pedidos', order: 1 },
  ];

  for (let i = 0; i < faqsData.length; i++) {
    const faq = faqsData[i];
    await prisma.fAQ.upsert({
      where: { id: `faq-${i + 1}` },
      update: faq,
      create: { id: `faq-${i + 1}`, ...faq },
    });
  }
  console.log('✅ FAQs created:', faqsData.length);

  // ==================== REVIEWS ====================
  console.log('⭐ Creating sample reviews...');

  const reviewsData = [
    { productSlug: 'iphone-15-pro-max', rating: 5, comment: 'Produto sensacional! Chegou antes do prazo, lacrado e com nota fiscal. Super recomendo a USS Brasil!', userName: 'Carlos M.' },
    { productSlug: 'iphone-15-pro-max', rating: 5, comment: 'Melhor custo-benefício que encontrei. Atendimento impecável da loja!', userName: 'Ana P.' },
    { productSlug: 'iphone-15-pro-max', rating: 4, comment: 'Produto excelente, só demorou um pouco mais que o esperado para chegar.', userName: 'Ricardo S.' },
    { productSlug: 'galaxy-s24-ultra', rating: 5, comment: 'O Galaxy AI é incrível! Câmera fantástica e bateria que dura o dia todo.', userName: 'Fernanda L.' },
    { productSlug: 'galaxy-s24-ultra', rating: 5, comment: 'Vim do iPhone e estou impressionado com a qualidade. Entrega super rápida!', userName: 'João V.' },
    { productSlug: 'airpods-pro-2', rating: 5, comment: 'Cancelamento de ruído perfeito! Uso para trabalhar e faz toda diferença.', userName: 'Mariana C.' },
    { productSlug: 'airpods-pro-2', rating: 5, comment: 'Original da Apple, lacrado. Preço justo comparado com outras lojas.', userName: 'Pedro H.' },
    { productSlug: 'apple-watch-series-9', rating: 5, comment: 'Presente para minha esposa, ela amou! Loja muito confiável.', userName: 'Lucas R.' },
    { productSlug: 'macbook-pro-14-m3', rating: 5, comment: 'Máquina absurda de potente! Parece até um investimento pro futuro.', userName: 'Thiago M.' },
    { productSlug: 'ipad-pro-m4', rating: 5, comment: 'Tela OLED sensacional, produtividade nota 10. Compra garantida!', userName: 'Camila F.' },
  ];

  const reviewProducts = await prisma.product.findMany({
    where: { slug: { in: reviewsData.map(r => r.productSlug) } },
    select: { id: true, slug: true },
  });

  // Delete existing reviews first to avoid conflicts
  await prisma.review.deleteMany({
    where: { userId: customer.id },
  });

  for (let i = 0; i < reviewsData.length; i++) {
    const reviewData = reviewsData[i];
    const product = reviewProducts.find(p => p.slug === reviewData.productSlug);
    if (product) {
      try {
        await prisma.review.create({
          data: {
            userId: customer.id,
            productId: product.id,
            rating: reviewData.rating,
            comment: reviewData.comment,
            isApproved: true,
          },
        });
      } catch (e) {
        // Skip if review already exists for this product/user combination
      }
    }
  }
  console.log('✅ Reviews created:', reviewsData.length);

  // ==================== COUPONS ====================
  console.log('🎟️ Creating sample coupons...');

  const couponsData = [
    {
      code: 'BEMVINDO10',
      description: '10% de desconto na primeira compra',
      discountType: 'PERCENTAGE' as const,
      discountValue: 10,
      minOrderValue: 100,
      maxDiscount: 200,
      usageLimit: 1000,
      isActive: true,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
    {
      code: 'WAVEPRO20',
      description: '20% de desconto em produtos WavePro',
      discountType: 'PERCENTAGE' as const,
      discountValue: 20,
      minOrderValue: 200,
      maxDiscount: 500,
      usageLimit: 200,
      isActive: true,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    {
      code: 'DESCONTO50',
      description: 'R$50 de desconto em compras acima de R$300',
      discountType: 'FIXED' as const,
      discountValue: 50,
      minOrderValue: 300,
      usageLimit: 100,
      isActive: true,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    },
    {
      code: 'SUPER100',
      description: 'R$100 de desconto em compras acima de R$800',
      discountType: 'FIXED' as const,
      discountValue: 100,
      minOrderValue: 800,
      usageLimit: 50,
      isActive: true,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    },
  ];

  for (const coupon of couponsData) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon,
    });
  }
  console.log('✅ Coupons created:', couponsData.length);

  console.log('🎉 Seed completed successfully!');
  console.log(`
📊 Summary:
   - Users: 2 (1 admin, 1 customer)
   - Categories: ${Object.keys(categories).length}
   - Brands: ${Object.keys(brands).length}
   - Products: ${products.length}
   - Hero Slides: ${heroSlidesData.length}
   - Banners: ${bannersData.length}
   - Testimonials: ${testimonialsData.length}
   - Home Sections: ${homeSectionsData.length}
   - Page Contents: ${pageContentsData.length}
   - Blog Posts: ${blogPostsData.length}
   - Promotions: ${promotionsData.length}
   - Stores: ${storesData.length}
   - Job Openings: ${jobsData.length}
   - FAQs: ${faqsData.length}
   - Reviews: ${reviewsData.length}
   - Coupons: ${couponsData.length}

👤 Test Accounts:
   Admin: admin@ussbrasil.com / admin123
   Customer: cliente@teste.com / cliente123

🎟️ Test Coupons:
   BEMVINDO10 - 10% off (mín R$100)
   FRETEGRATIS - Frete grátis (mín R$150)
   WAVEPRO20 - 20% off (mín R$200)
   DESCONTO50 - R$50 off (mín R$300)

📍 Stores:
   - Florianópolis Centro (Matriz)
   - Shopping Iguatemi
   - Joinville Centro
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
