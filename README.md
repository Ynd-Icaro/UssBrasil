# USS Brasil - E-commerce

Sistema completo de e-commerce desenvolvido com NestJS (Backend) e Next.js (Frontend).

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados (Supabase)
- **JWT** - Autenticação
- **Stripe** - Pagamentos
- **Nodemailer** - Envio de emails
- **Pusher** - Notificações em tempo real

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Formulários

## 📁 Estrutura

```
UssBrasil/
├── backend/           # API NestJS
│   ├── prisma/        # Schema e migrations
│   └── src/
│       ├── common/    # Módulos compartilhados
│       └── modules/   # Módulos da aplicação
│
└── frontend/          # App Next.js
    └── src/
        ├── app/       # Rotas (App Router)
        ├── components/# Componentes React
        ├── lib/       # Utilitários
        ├── store/     # Estado global
        └── types/     # Tipos TypeScript
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL ou conta Supabase

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Sincronizar banco de dados
npx prisma db push

# Gerar cliente Prisma
npx prisma generate

# Seed de dados
npx prisma db seed

# Iniciar em desenvolvimento
npm run start:dev
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local

# Iniciar em desenvolvimento
npm run dev
```

## 🔧 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="sua-chave-secreta"
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
MAIL_HOST="smtp.gmail.com"
MAIL_USER="email@gmail.com"
MAIL_PASS="app-password"
PUSHER_APP_ID="..."
PUSHER_KEY="..."
PUSHER_SECRET="..."
PUSHER_CLUSTER="..."
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_STRIPE_KEY="pk_..."
NEXT_PUBLIC_PUSHER_KEY="..."
NEXT_PUBLIC_PUSHER_CLUSTER="..."
```

## 📚 Documentação API

Com o backend rodando, acesse:
- Swagger: `http://localhost:3001/api/docs`

## 🔐 Contas de Teste

Após rodar o seed:
- **Admin:** admin@ussbrasil.com / admin123
- **Cliente:** cliente@teste.com / cliente123

## 📝 Funcionalidades

### Cliente
- [x] Catálogo de produtos com filtros
- [x] Carrinho de compras
- [x] Checkout com Stripe
- [x] Conta do usuário
- [x] Histórico de pedidos
- [x] Lista de desejos
- [x] Cálculo de frete
- [x] Cupons de desconto
- [x] Avaliações de produtos
- [x] Newsletter

### Administração
- [x] Dashboard com estatísticas
- [x] Gestão de produtos
- [x] Gestão de categorias
- [x] Gestão de marcas
- [x] Gestão de pedidos
- [x] Gestão de usuários
- [x] CMS (Hero, Banners, Páginas)
- [x] Configurações gerais
- [x] Cupons de desconto

## 🎨 Temas

O sistema possui tema escuro por padrão com cores customizáveis:
- **USS Brasil:** Azul + Branco
- **WavePro:** Amarelo + Preto

## 📦 Scripts

### Backend
```bash
npm run start:dev    # Desenvolvimento com hot reload
npm run build        # Build de produção
npm run start:prod   # Iniciar produção
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # Verificar código
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
