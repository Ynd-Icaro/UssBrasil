'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Por favor, insira seu e-mail');
      return;
    }

    setStatus('loading');

    try {
      await api.post('/newsletter/subscribe', { email });
      setStatus('success');
      setMessage('Inscrição realizada com sucesso! 🎉');
      setEmail('');
    } catch (error: any) {
      setStatus('error');
      if (error.response?.status === 409) {
        setMessage('Este e-mail já está inscrito');
      } else {
        setMessage('Erro ao realizar inscrição. Tente novamente.');
      }
    }
  };

  return (
    <section className="py-20 bg-surface border-y border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Receba ofertas exclusivas
          </h2>
          <p className="text-text-secondary mb-8 text-lg">
            Seja o primeiro a saber sobre lançamentos e promoções imperdíveis.
            <br />
            <span className="text-primary">10% de desconto</span> na primeira compra!
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus('idle');
              }}
              placeholder="Seu melhor e-mail"
              disabled={status === 'loading'}
              className="flex-1 px-6 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
              whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
              disabled={status === 'loading'}
              className="px-8 py-4 bg-primary text-black font-bold rounded-xl shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Inscrevendo...
                </>
              ) : status === 'success' ? (
                <>
                  <Check className="w-5 h-5" />
                  Inscrito!
                </>
              ) : (
                'Inscrever-se'
              )}
            </motion.button>
          </form>

          {/* Status message */}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 text-sm ${
                status === 'success' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {message}
            </motion.p>
          )}

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-text-muted text-sm">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Sem spam
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Cancele quando quiser
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
