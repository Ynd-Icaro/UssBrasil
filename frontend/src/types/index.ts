export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  _count?: {
    products: number;
  };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
  isMain: boolean;
}

export interface ProductColor {
  id?: string;
  name: string;
  hexCode?: string;
  images: string[];
  stock: number;
  priceModifier?: number;
  isDefault: boolean;
}

export interface ProductVariant {
  id?: string;
  name: string;
  sku?: string;
  ncm?: string;
  options?: Record<string, string>;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  priceAdjustment?: number;
  stock: number;
  image?: string;
  serialNumbers: string[];
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  
  // Pricing
  price: number;
  comparePrice?: number;
  costPrice?: number;
  suggestedPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
  discountPrice?: number;
  stripeDiscount?: number;
  stripeFinalPrice?: number;
  finalPrice?: number;
  markup?: number;
  profitMargin?: number;
  profitValue?: number;
  
  // SKU/Inventory
  sku?: string;
  barcode?: string;
  ncm?: string;
  cest?: string;
  origin?: string;
  stock: number;
  lowStockAlert?: number;
  trackStock: boolean;
  hasVariations: boolean;
  
  // Dimensions
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPreOrder: boolean;
  isWavePro: boolean;
  condition?: string;
  warranty?: string;
  
  // Specifications
  specifications?: Record<string, string>;
  sizes: string[];
  storageOptions: string[];
  tags: string[];
  
  // Relations
  categoryId: string;
  category?: Category;
  brandId?: string;
  brand?: Brand;
  images: ProductImage[];
  variants: ProductVariant[];
  colors: ProductColor[];
  reviews?: Review[];
  
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: ProductImage[];
  };
  variantInfo?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  addressId: string;
  address: Address;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingMethod?: string;
  trackingCode?: string;
  notes?: string;
  items: OrderItem[];
  payment?: Payment;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  stripePaymentId?: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variantInfo?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AddressFormData {
  label?: string;
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
}
