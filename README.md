# FoodShorts 🍕

App de delivery mobile focado em **feed de vídeos/banners curtos** publicados por lojistas. Sistema completo com fidelidade **Foodcoins**, **WalletCredit** e **Planos de Assinatura**.

## 🏗️ Arquitetura

```
foodshorts/
├── apps/
│   ├── mobile/          # React Native (Expo Router)
│   ├── server/          # Node.js + Fastify + Prisma
│   └── web/             # Next.js Admin Panel
└── packages/
    ├── ui/              # Componentes compartilhados
    └── config/          # Configurações compartilhadas
```

## 🚀 Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Mobile** | React Native, Expo Router, TypeScript, Zustand, Tailwind CSS |
| **Backend** | Node.js 18, Fastify, Prisma, PostgreSQL 15 |
| **Web** | Next.js, React, TypeScript |
| **Auth** | JWT/Refresh, Twilio Verify |
| **Pagamentos** | Stripe Connect + Billing |
| **Mídia** | AWS S3 / Cloudflare R2 |
| **Maps** | Google Maps API |

## 📱 Principais Features

### Para Usuários
- **Feed de vídeos curtos** estilo shorts com produtos
- **Sistema Foodcoins** - fidelidade com 60 dias de validade
- **Recarga WalletCredit** com 5% de bônus
- **Chat interno** e suporte WhatsApp
- **Rastreamento de pedidos** em tempo real

### Para Lojistas
- **Planos de assinatura** (FREE 18%, PRO 8%, PREMIUM negociável)
- **Add-on Social Boost** - gestão redes sociais
- **Dashboard de métricas** e vendas
- **Sistema de ranking** baseado em performance

### Sistema de Pontos (Foodcoins)

| Origem | Conversão | Bônus |
|--------|-----------|-------|
| Pedido normal | R$ 5 = 1 coin | - |
| Recarga WalletCredit | R$ 5 = 2 coins | 2x |
| Assinatura/Add-on | R$ 5 = 2 coins | 2x |

- **Validade:** 60 dias
- **Uso máximo:** 30% do valor do pedido
- **Valor:** 1 coin = R$ 0,20

## 🛠️ Desenvolvimento

### Requisitos
- Node.js 18+
- PostgreSQL 15+
- React Native CLI / Expo CLI

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd foodshorts

# Instalar dependências
npm install

# Configurar banco de dados
cd apps/server
cp .env.example .env
# Editar .env com suas configurações

# Executar migrações
npm run db:migrate

# Executar seeds (opcional)
npm run db:seed
```

### Executar em desenvolvimento

```bash
# Terminal 1 - Servidor
cd apps/server
npm run dev

# Terminal 2 - Mobile
cd apps/mobile  
npm start

# Terminal 3 - Admin Web (opcional)
cd apps/web
npm run dev
```

## 📊 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token

### Feed
- `GET /api/feed` - Listar posts do feed
- `GET /api/feed/search` - Buscar posts
- `POST /api/feed` - Criar post (lojista)

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Histórico de pedidos
- `GET /api/orders/:id` - Detalhes do pedido

### Carteira
- `GET /api/wallet` - Saldo e foodcoins
- `POST /api/wallet/topup` - Recarga com bônus 5%
- `GET /api/wallet/transactions` - Histórico

## 🔐 Segurança & Compliance

- **Senhas:** Argon2id hashing
- **JWT:** Access (15min) + Refresh (7d) tokens
- **LGPD:** Endpoints para exportar/excluir dados
- **Fraude:** Stripe Radar + limites de cupons
- **Audit:** Logs de ações críticas

## 📋 Backlog & Próximas Features

- [ ] Integração WhatsApp Cloud API
- [ ] Notificações push (OneSignal)
- [ ] Feature flags (Unleash)
- [ ] Analytics (PostHog)
- [ ] Pagamento PIX
- [ ] Programa de afiliados
- [ ] Delivery tracking GPS
- [ ] Moderação de conteúdo IA

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🚀 Deploy na Vercel (NOVO!)

### 1. Preparar para Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login
```

### 2. Deploy automático via GitHub

1. **Push para GitHub:**
```bash
git init
git add .
git commit -m "FoodShorts v1.0 - Ready for Vercel"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/foodshorts.git
git push -u origin main
```

2. **Conectar na Vercel:**
- Acesse [vercel.com](https://vercel.com)
- Import do GitHub
- Deploy automático

### 3. Ou deploy direto:
```bash
./deploy-vercel.sh
```

### 4. URLs após deploy:
- **Admin Panel**: `https://foodshorts.vercel.app`
- **API Backend**: `https://foodshorts.vercel.app/api`

---

**FoodShorts** - Conectando pessoas através da comida, um vídeo por vez! 🎬🍕