'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Search, 
  User, 
  ChevronDown,
  Phone,
  MapPin,
  Instagram,
  Heart,
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { CartDrawer } from '@/components/cart';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/products', label: 'Produtos' },
  { 
    href: '#', 
    label: 'Categorias',
    submenu: [
      { href: '/categories/peliculas', label: 'Películas' },
      { href: '/categories/acessorios', label: 'Acessórios' },
      { href: '/categories/capas', label: 'Capas' },
      { href: '/categories/carregadores', label: 'Carregadores' },
      { href: '/categories/fones', label: 'Fones de Ouvido' },
      { href: '/categories/smartwatches', label: 'Smartwatches' },
    ]
  },
  { href: '/wavepro', label: 'WavePro', highlight: true },
  { href: '/contato', label: 'Contato' },
];

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { totalItems, openCart } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const cartItemCount = totalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white text-sm py-2.5 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:4830456044" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-medium">(48) 3045-6044</span>
            </a>
            <a href="https://maps.google.com" target="_blank" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <MapPin className="w-3.5 h-3.5" />
              <span>Praça Nereu Ramos, 364 - Centro</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com/comercialussbrasil" 
              target="_blank" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@comercialussbrasil</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white shadow-md border-b border-border'
            : 'bg-white/95 backdrop-blur-sm'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="flex items-center"
              >
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-foreground">USS</span>
                  <span className="text-primary">BRASIL</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.submenu && setActiveSubmenu(link.label)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 relative group',
                      link.highlight
                        ? 'text-wavepro-primary hover:bg-wavepro-primary/10 font-bold'
                        : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                    )}
                  >
                    {link.label}
                    {link.submenu && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                    {link.highlight && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-wavepro-primary rounded-full animate-pulse" />
                    )}
                  </Link>

                  {/* Submenu */}
                  <AnimatePresence>
                    {link.submenu && activeSubmenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-lg overflow-hidden"
                      >
                        {link.submenu.map((sublink, index) => (
                          <motion.div
                            key={sublink.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={sublink.href}
                              className="block px-5 py-3 text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200 border-b border-border/50 last:border-0"
                            >
                              {sublink.label}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200 hidden sm:flex"
              >
                <Heart className="w-5 h-5" />
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => isAuthenticated ? setIsUserMenuOpen(!isUserMenuOpen) : router.push('/login')}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isAuthenticated && isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-border bg-surface-light">
                        <p className="font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-text-muted truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Minha Conta</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span>Meus Pedidos</span>
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Painel Admin</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-text-secondary hover:text-error hover:bg-error/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sair</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCart}
                className="relative w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-white hover:bg-primary-hover transition-all duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-wavepro-primary text-black text-xs font-bold rounded-full flex items-center justify-center shadow-md"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200 ml-1"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-border overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div 
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => !link.submenu && setIsMobileMenuOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-lg font-medium transition-all duration-200',
                        link.highlight
                          ? 'text-wavepro-primary bg-wavepro-primary/10 border border-wavepro-primary/20'
                          : 'text-foreground hover:bg-primary/5 hover:text-primary'
                      )}
                    >
                      <span className="flex items-center justify-between">
                        {link.label}
                        {link.highlight && <span className="text-xs bg-wavepro-primary text-black px-2 py-0.5 rounded-full font-bold">Novo</span>}
                      </span>
                    </Link>
                    {link.submenu && (
                      <div className="ml-4 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.href}
                            href={sublink.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-2.5 text-text-secondary hover:text-primary rounded-lg transition-colors"
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Mobile Auth */}
                {!isAuthenticated && (
                  <div className="pt-4 mt-4 border-t border-border space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Criar Conta
                    </Link>
                  </div>
                )}

                {/* Mobile Contact */}
                <div className="pt-4 mt-4 border-t border-border">
                  <a href="tel:4830456044" className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>(48) 3045-6044</span>
                  </a>
                  <a href="https://instagram.com/comercialussbrasil" target="_blank" className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary transition-colors">
                    <Instagram className="w-4 h-4" />
                    <span>@comercialussbrasil</span>
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl mx-4"
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
                  <input
                    type="text"
                    placeholder="O que você está procurando?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-16 pr-6 py-5 bg-white border border-border rounded-2xl text-lg text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-center gap-4 mt-4 text-white/80 text-sm">
                <span className="px-3 py-1 bg-white/20 rounded-lg">ESC</span>
                <span>para fechar</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
