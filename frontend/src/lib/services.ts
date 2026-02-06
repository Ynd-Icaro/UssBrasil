// Serviços de API organizados por domínio

import api from './api';
import { API_ENDPOINTS } from './constants';

// ==================== AUTH ====================
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.login, { email, password });
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await api.post(API_ENDPOINTS.register, data);
    return response.data;
  },

  refresh: async () => {
    const response = await api.post(API_ENDPOINTS.refresh);
    return response.data;
  },

  logout: async () => {
    await api.post(API_ENDPOINTS.logout);
  },

  forgotPassword: async (email: string) => {
    const response = await api.post(API_ENDPOINTS.forgotPassword, { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.resetPassword, { token, password });
    return response.data;
  },
};

// ==================== PRODUCTS ====================
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  isNew?: boolean;
}

export const productService = {
  getAll: async (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`${API_ENDPOINTS.products}?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.product(id));
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(API_ENDPOINTS.productBySlug(slug));
    return response.data;
  },

  getFeatured: async (limit = 8) => {
    const response = await api.get(`${API_ENDPOINTS.featuredProducts}?limit=${limit}`);
    return response.data;
  },

  getNew: async (limit = 6) => {
    const response = await api.get(`${API_ENDPOINTS.newProducts}?limit=${limit}`);
    return response.data;
  },

  search: async (query: string, limit = 10) => {
    const response = await api.get(`${API_ENDPOINTS.products}?search=${query}&limit=${limit}`);
    return response.data;
  },
};

// ==================== CATEGORIES ====================
export const categoryService = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.categories);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.category(id));
    return response.data;
  },

  getProducts: async (categoryId: string, filters?: ProductFilters) => {
    return productService.getAll({ ...filters, category: categoryId });
  },
};

// ==================== BRANDS ====================
export const brandService = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.brands);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.brand(id));
    return response.data;
  },

  getProducts: async (brandId: string, filters?: ProductFilters) => {
    return productService.getAll({ ...filters, brand: brandId });
  },
};

// ==================== CART ====================
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export const cartService = {
  get: async () => {
    const response = await api.get(API_ENDPOINTS.cart);
    return response.data;
  },

  add: async (item: CartItem) => {
    const response = await api.post(API_ENDPOINTS.addToCart, item);
    return response.data;
  },

  update: async (itemId: string, quantity: number) => {
    const response = await api.put(API_ENDPOINTS.updateCart, { itemId, quantity });
    return response.data;
  },

  remove: async (itemId: string) => {
    const response = await api.delete(API_ENDPOINTS.removeFromCart(itemId));
    return response.data;
  },

  clear: async () => {
    const response = await api.delete(API_ENDPOINTS.cart);
    return response.data;
  },
};

// ==================== ORDERS ====================
export interface CreateOrderData {
  items: CartItem[];
  addressId: string;
  paymentMethod: 'credit' | 'pix' | 'boleto';
  shippingMethod: string;
  couponCode?: string;
}

export const orderService = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.orders);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.order(id));
    return response.data;
  },

  create: async (data: CreateOrderData) => {
    const response = await api.post(API_ENDPOINTS.createOrder, data);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.post(`${API_ENDPOINTS.order(id)}/cancel`);
    return response.data;
  },
};

// ==================== USER ====================
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface AddressData {
  label?: string;
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export const userService = {
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.profile);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put(API_ENDPOINTS.profile, data);
    return response.data;
  },

  getAddresses: async () => {
    const response = await api.get(API_ENDPOINTS.addresses);
    return response.data;
  },

  addAddress: async (data: AddressData) => {
    const response = await api.post(API_ENDPOINTS.addresses, data);
    return response.data;
  },

  updateAddress: async (id: string, data: AddressData) => {
    const response = await api.put(`${API_ENDPOINTS.addresses}/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: string) => {
    const response = await api.delete(`${API_ENDPOINTS.addresses}/${id}`);
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get(API_ENDPOINTS.wishlist);
    return response.data;
  },

  addToWishlist: async (productId: string) => {
    const response = await api.post(API_ENDPOINTS.wishlist, { productId });
    return response.data;
  },

  removeFromWishlist: async (productId: string) => {
    const response = await api.delete(`${API_ENDPOINTS.wishlist}/${productId}`);
    return response.data;
  },
};

// ==================== REVIEWS ====================
export interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

export const reviewService = {
  getByProduct: async (productId: string) => {
    const response = await api.get(API_ENDPOINTS.reviews(productId));
    return response.data;
  },

  create: async (data: CreateReviewData) => {
    const response = await api.post(API_ENDPOINTS.createReview, data);
    return response.data;
  },
};

// ==================== SHIPPING ====================
export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  carrier: string;
}

export const shippingService = {
  calculate: async (zipCode: string, items: CartItem[]): Promise<ShippingOption[]> => {
    const response = await api.post(API_ENDPOINTS.calculateShipping, { zipCode, items });
    return response.data;
  },

  getAddressByZip: async (zipCode: string) => {
    // ViaCEP integration
    const cleanZip = zipCode.replace(/\D/g, '');
    const response = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
    const data = await response.json();
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  },
};

// ==================== PAYMENT ====================
export interface PaymentIntentData {
  orderId: string;
  paymentMethod: 'credit' | 'pix' | 'boleto';
}

export const paymentService = {
  createIntent: async (data: PaymentIntentData) => {
    const response = await api.post(API_ENDPOINTS.createPaymentIntent, data);
    return response.data;
  },
};

// ==================== CONTACT ====================
export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const contactService = {
  send: async (data: ContactData) => {
    const response = await api.post(API_ENDPOINTS.contact, data);
    return response.data;
  },

  subscribeNewsletter: async (email: string) => {
    const response = await api.post(API_ENDPOINTS.newsletter, { email });
    return response.data;
  },
};

// ==================== CMS ====================
export const cmsService = {
  getHeroSlides: async () => {
    const response = await api.get(API_ENDPOINTS.heroSlides);
    return response.data;
  },

  getBanners: async (position?: string) => {
    const url = position 
      ? `${API_ENDPOINTS.banners}?position=${position}` 
      : API_ENDPOINTS.banners;
    const response = await api.get(url);
    return response.data;
  },

  getTestimonials: async () => {
    const response = await api.get(API_ENDPOINTS.testimonials);
    return response.data;
  },

  getPageContent: async (slug: string) => {
    const response = await api.get(API_ENDPOINTS.pageContent(slug));
    return response.data;
  },
};

// Export default com todos os serviços
export default {
  auth: authService,
  products: productService,
  categories: categoryService,
  brands: brandService,
  cart: cartService,
  orders: orderService,
  user: userService,
  reviews: reviewService,
  shipping: shippingService,
  payment: paymentService,
  contact: contactService,
  cms: cmsService,
};
