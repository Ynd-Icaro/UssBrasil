import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta USS Brasil - Azul Escuro e Branco
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
          alt: '#f1f5f9',
        },
        foreground: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
        },
        primary: {
          DEFAULT: '#0369a1', // Azul mais escuro
          hover: '#0284c7',
          dark: '#075985',
          light: '#0ea5e9',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        card: {
          DEFAULT: '#ffffff',
          hover: '#f8fafc',
        },
        border: {
          DEFAULT: '#e2e8f0',
          light: '#f1f5f9',
          dark: '#cbd5e1',
        },
        surface: {
          DEFAULT: '#ffffff',
          hover: '#f8fafc',
          light: '#f1f5f9',
        },
        brand: {
          DEFAULT: '#0369a1', // Azul mais escuro
          hover: '#0284c7',
          light: '#0ea5e9',
          dark: '#075985',
        },
        text: {
          primary: '#0f172a', // Preto/escuro para textos
          secondary: '#475569',
          muted: '#94a3b8',
        },
        accent: {
          blue: '#0369a1',
          sky: '#0ea5e9',
        },
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#0ea5e9',
        // WavePro Brand - Preto e Amarelo (apenas para seção WavePro)
        wavepro: {
          primary: '#eab308',
          dark: '#000000',
          accent: '#facc15',
          bg: '#09090b',
          text: '#fafafa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #0369a1, 0 0 10px #0369a1' },
          '100%': { boxShadow: '0 0 20px #0369a1, 0 0 30px #0369a1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(3, 105, 161, 0.3)',
        'glow-lg': '0 0 40px rgba(3, 105, 161, 0.4)',
        'glow-yellow': '0 0 20px rgba(234, 179, 8, 0.3)', // Para WavePro
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
