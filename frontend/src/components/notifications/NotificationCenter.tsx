'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Package, 
  ShoppingBag, 
  User, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Pusher from 'pusher-js';

interface Notification {
  id: string;
  type: 'order' | 'product' | 'user' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp: Date;
  read: boolean;
}

const typeIcons: Record<string, any> = {
  order: ShoppingBag,
  product: Package,
  user: User,
  system: AlertTriangle,
};

const typeColors: Record<string, string> = {
  order: 'text-green-500 bg-green-500/10',
  product: 'text-blue-500 bg-blue-500/10',
  user: 'text-purple-500 bg-purple-500/10',
  system: 'text-primary bg-primary/10',
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((data: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...data,
      id: crypto.randomUUID(),
      read: false,
      timestamp: new Date(data.timestamp),
    };
    
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
    setHasNewNotification(true);
    
    // Play sound
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'sa1';

    if (!pusherKey) {
      console.log('Pusher não configurado');
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    // Canal público para broadcast
    const publicChannel = pusher.subscribe('public');
    publicChannel.bind('broadcast', addNotification);

    // Canal de admin (se for admin)
    const adminChannel = pusher.subscribe('admin-notifications');
    adminChannel.bind('new-order', addNotification);
    adminChannel.bind('order-update', addNotification);
    adminChannel.bind('low-stock', addNotification);
    adminChannel.bind('new-user', addNotification);

    return () => {
      pusher.unsubscribe('public');
      pusher.unsubscribe('admin-notifications');
      pusher.disconnect();
    };
  }, [addNotification]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewNotification(false);
        }}
        className="relative w-11 h-11 rounded-xl flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all duration-200"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
        {hasNewNotification && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"
          />
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h3 className="text-foreground font-semibold">Notificações</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-text-muted">{unreadCount} não lidas</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-border mx-auto mb-3" />
                    <p className="text-text-muted">Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = typeIcons[notification.type] || Bell;
                    const colorClass = typeColors[notification.type] || 'text-text-secondary bg-surface';

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => markAsRead(notification.id)}
                        className={`
                          p-4 border-b border-border/50 cursor-pointer transition-colors
                          ${notification.read ? 'bg-transparent' : 'bg-primary/5'}
                          hover:bg-surface-hover
                        `}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium text-foreground truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-sm text-text-secondary line-clamp-2 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-text-muted mt-1.5">
                              {formatDistanceToNow(new Date(notification.timestamp), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border bg-surface/50">
                  <button
                    onClick={clearAll}
                    className="w-full py-2 text-sm text-text-muted hover:text-foreground transition-colors"
                  >
                    Limpar todas
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
