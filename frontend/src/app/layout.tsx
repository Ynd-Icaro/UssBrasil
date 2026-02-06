import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'USSBRASIL - Premium Tech Store',
    template: '%s | USSBRASIL',
  },
  description: 'A melhor loja de tecnologia premium do Brasil. Apple, DJI, JBL, Xiaomi e muito mais.',
  keywords: ['tecnologia', 'apple', 'iphone', 'dji', 'jbl', 'xiaomi', 'ecommerce', 'brasil'],
  authors: [{ name: 'USSBRASIL' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'USSBRASIL',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E1E1E',
                color: '#E5E7EB',
                border: '1px solid #2A2A2A',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#1E1E1E',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#1E1E1E',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
