'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Gift, 
  Percent, 
  Clock, 
  Copy, 
  Check,
  ChevronRight
} from 'lucide-react';

interface PromoBannerProps {
  show?: boolean;
}

const promos = [
  {
    id: 1,
    text: 'Frete Grátis acima de R$ 199',
    icon: Gift,
    color: 'bg-green-500',
    link: '/products',
  },
  {
    id: 2,
    text: 'PIX com 5% de desconto',
    icon: Percent,
    color: 'bg-blue-500',
    link: '/parcelamento',
  },
  {
    id: 3,
    text: 'Até 12x sem juros no cartão',
    icon: Clock,
    color: 'bg-purple-500',
    link: '/parcelamento',
  },
];

export function PromoBanner({ show = true }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [currentPromo, setCurrentPromo] = useState(0);

  // Rotate promos every 5 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  if (!isVisible) return null;

  const promo = promos[currentPromo];
  const Icon = promo.icon;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`${promo.color} text-white relative overflow-hidden`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <AnimatePresence mode="wait">
              <motion.span
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-medium"
              >
                {promo.text}
              </motion.span>
            </AnimatePresence>
          </div>
          <a 
            href={promo.link}
            className="text-xs underline underline-offset-2 hover:no-underline hidden sm:inline"
          >
            Saiba mais
          </a>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Coupon Card Component
interface CouponCardProps {
  code: string;
  description: string;
  discount: string;
  minValue?: string;
  validUntil?: string;
  isActive?: boolean;
}

export function CouponCard({ 
  code, 
  description, 
  discount, 
  minValue, 
  validUntil,
  isActive = true 
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 border-dashed ${
      isActive ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50 opacity-60'
    }`}>
      {/* Left decoration */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />
      
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-2xl font-bold ${isActive ? 'text-primary' : 'text-gray-500'}`}>
            {discount}
          </span>
          {!isActive && (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
              Expirado
            </span>
          )}
        </div>
        
        <p className="text-text font-medium mb-1">{description}</p>
        {minValue && (
          <p className="text-text-secondary text-sm">Compras acima de {minValue}</p>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <code className={`px-3 py-1 ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'} rounded font-mono font-bold tracking-wider`}>
              {code}
            </code>
            {isActive && (
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                title="Copiar código"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-text-secondary" />
                )}
              </button>
            )}
          </div>
          
          {validUntil && (
            <span className="text-xs text-text-secondary">
              Válido até {validUntil}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Countdown Timer Component
interface CountdownProps {
  targetDate: Date;
  title?: string;
}

export function CountdownTimer({ targetDate, title = 'Promoção termina em:' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  });

  if (timeLeft.expired) {
    return (
      <div className="text-center py-4 text-red-500 font-medium">
        Promoção encerrada!
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Dias' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Seg' },
  ];

  return (
    <div className="text-center">
      <p className="text-text-secondary text-sm mb-3">{title}</p>
      <div className="flex justify-center gap-3">
        {timeUnits.map((unit, index) => (
          <div key={unit.label}>
            <div className="flex items-center gap-3">
              <div className="bg-surface border border-border rounded-lg p-3 min-w-[60px]">
                <span className="text-2xl font-bold text-text block">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-xs text-text-secondary">{unit.label}</span>
              </div>
              {index < timeUnits.length - 1 && (
                <span className="text-2xl text-text-secondary font-bold">:</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Feature Badge Component
interface FeatureBadgeProps {
  icon: React.ElementType;
  title: string;
  description: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function FeatureBadge({ 
  icon: Icon, 
  title, 
  description,
  variant = 'default' 
}: FeatureBadgeProps) {
  const variants = {
    default: 'bg-surface border-border text-text-secondary',
    primary: 'bg-primary/10 border-primary/20 text-primary',
    success: 'bg-green-50 border-green-200 text-green-600',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-600',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${variants[variant]}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        variant === 'default' ? 'bg-primary/10' : 'bg-white/50'
      }`}>
        <Icon className={`w-5 h-5 ${variant === 'default' ? 'text-primary' : ''}`} />
      </div>
      <div>
        <p className="font-medium text-text">{title}</p>
        <p className={`text-sm ${variant === 'default' ? 'text-text-secondary' : ''}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

// Quick Link Card
interface QuickLinkCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
}

export function QuickLinkCard({ 
  href, 
  icon: Icon, 
  title, 
  description,
  color = 'text-primary bg-primary/10' 
}: QuickLinkCardProps) {
  return (
    <a
      href={href}
      className="group block p-6 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
        {title}
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </a>
  );
}
