## Índice
1. [Visão Geral](#visão-geral)  
2. [Principais Requisitos](#principais-requisitos)  
3. [Arquitetura & Stack](#arquitetura--stack)  
4. [Fluxo de Usuário](#fluxo-de-usuário)  
5. [Banco & Entidades (Prisma)](#banco--entidades-prisma)  
6. [Endpoints REST](#endpoints-rest)  
7. [Foodcoins](#foodcoins)  
8. [Recarga + Bônus 5 %](#recarga--bônus-5)  
9. [Planos & Assinaturas](#planos--assinaturas)  
10. [Add‑on – Social Boost 📈](#add‑on--social-boost-📈)  
11. [Ranking & Discoverability](#ranking--discoverability)  
12. [Backup & Disaster Recovery](#backup--disaster-recovery)  
13. [Segurança, LGPD & Fraude](#segurança-lgpd--fraude)  
14. [Suporte & Comunicação](#suporte--comunicação)  
15. [Mockup – Home / FeedScreen](#mockup--home--feedscreen)  
16. [UI/UX & Design System](#uiux--design-system)  
17. [Tipografia](#tipografia)  
18. [Componentes Chave](#componentes-chave)  
19. [Notificações & Webhooks](#notificações--webhooks)  
20. [Observability & Custos](#observability--custos)  
21. [Feature Flags & Beta](#feature-flags--beta)  
22. [Admin & Governança](#admin--governança)  
23. [Testes & Qualidade](#testes--qualidade)  
24. [CI/CD & Deploy](#cicd--deploy)  
25. [Estrutura de Pastas](#estrutura-de-pastas)  
26. [Próximas Etapas](#próximas-etapas)

---

## Visão Geral
App de delivery mobile (React Native) focado em **feed de vídeos/banners curtos** publicados por lojistas. O usuário vê cards convencionais; vídeos ou banners aparecem em mini‑player 16:9. Sistemas de fidelidade **Foodcoins**, **WalletCredit** (recarga +5 %) e **Planos de Assinatura** para lojistas geram receita previsível.

---

## Principais Requisitos
- **Backup & DR:** RPO ≤ 30 min · RTO ≤ 2 h  
- **Chat & WhatsApp notifications** cliente ↔ loja ↔ entregador  
- **LGPD** exportar / excluir dados on‑demand  
- **Stripe Radar**, limite de cupons  
- **PWA Dashboard**, offline cache feed (50 posts)  
- **Performance budget:** bundle ≤ 4 MB · FCP ≤ 200 ms  
- **Audit Logs** ações críticas · **Feature flags** · **Marketing automation**

---

## Arquitetura & Stack
| Camada | Tecnologias |
|--------|-------------|
| **Mobile** | React Native (Expo Router) · Typescript · Zustand · Tailwind CSS (twrnc) |
| **Back‑end** | Node.js 18 · Fastify · Prisma · PostgreSQL 15 |
| **Auth** | JWT/Refresh · Twilio Verify · Nodemailer |
| **Mídia** | AWS S3 / Cloudflare R2 |
| **IA** | OpenAI Vision · GPT‑4o |
| **Pagamentos** | Stripe Connect + Billing |
| **Maps** | Google Maps Directions/Distance |
| **Realtime** | Socket.IO |
| **Flags** | Unleash |
| **Marketing** | PostHog + OneSignal |
| **CI/CD** | GitHub Actions · Fly.io · EAS Build |

---

## Fluxo de Usuário
*(inclui botão “Suporte WhatsApp” pós‑pedido e exportação LGPD em Settings › Privacidade)*

---

## Banco & Entidades (Prisma)
```prisma
model AuditLog {
  id          String   @id @default(uuid())
  userId      String?
  adminId     String?
  action      String
  targetId    String?
  metadata    Json?
  createdAt   DateTime @default(now())
}

/* + todos os modelos: User, VendorProfile, FeedItem, Order,
   VendorSubscription, VendorAddonSubscription, DeliveryMetric, etc. */
Endpoints REST (adicional)
http
Copiar
Editar
# LGPD
GET    /me/export            # JSON zip
DELETE /me                   # exclusão conta

# Chat / Suporte
POST   /support/chat
GET    /support/chat/:id

# Audit Log
GET    /admin/audit
Foodcoins
Regras de acúmulo
Origem	Conversão padrão	Promoção (2×)
Pedido normal	floor(total/5)	—
Recarga WalletCredit	—	2× floor(valor/5)
Assinatura / Add‑on	—	2× floor(valor/5)

ts
Copiar
Editar
const COINS_PER_REAL = 1/5;
const coinsOrder = Math.floor(total * COINS_PER_REAL);
const coinsTopup = Math.floor(value * COINS_PER_REAL) * 2;
Expiram em 60 dias, transferíveis, máx. 30 % do pedido.

Recarga + Bônus 5 %
Saldo nunca expira · 100 % utilizável.

Planos & Assinaturas
FREE – 18 % comissão · R$ 0/mês

PRO – 8 % comissão · R$ 149/mês · trial 14d

PREMIUM – negociável

Add‑on – Social Boost 📈
Gestão FB/IG (3 posts/sem) · 1 Ads/mês · SLA 4 h – R$ 299/mês

Ranking & Discoverability
rankingScore = (stars*0.6) + (onTime*0.25) + (volume*0.1) + (planBonus)
Feed e busca ordenam por score desc.

Backup & Disaster Recovery
PITR via WAL‑G → S3 · snapshots horários · RTO ≤ 2 h

Segurança, LGPD & Fraude
Argon2id · Stripe Radar · limites cupons · endpoints LGPD · PCI SAQ‑A · AuditLog

Suporte & Comunicação
Chat interno (WebSocket) · WhatsApp Cloud · Bot FAQ + hand‑off

Mockup – Home / FeedScreen
nginx
Copiar
Editar
Header  |  Busca
Carousel horizontal destaques (banner/vídeo LIVE)
─── Feed (cards 16:9 + info + “Pedir agora”) ───
FAB carrinho
Vídeos rodam em mini‑player; layout não é estilo TikTok.

UI/UX & Design System
Tokens Tailwind, fontes Everett (texto) + Aeonik (números) · Dark Mode

Tipografia
Uso	Fonte	Peso
Texto	Everett	300‑700
Valores	Aeonik	400/700

Componentes Chave
FeedCard · VendorProfileScreen · SupportChatWidget · OfflineSnackbar · FeatureFlagToggle

Notificações & Webhooks
WhatsApp templates · Stripe + PostHog webhooks

Observability & Custos
Datadog APM · alerta custo Maps/OpenAI > R$ 200/dia

Feature Flags & Beta
Unleash self‑host · rollout 1 % → 100 % · TestFlight/Play Internal

Admin & Governança
Painel Next.js (Clerk) · CRUD · moderação · plans · audit viewer

Testes & Qualidade
DR drills trimestrais · fraude scenarios · Lighthouse budgets

CI/CD & Deploy
Backups nightly · SonarCloud gate · Feature flag promotion após E2E

Estrutura de Pastas
bash
Copiar
Editar
foodshorts/
 ├ apps/mobile/
 ├ apps/server/
 ├ apps/web/
 └ packages/{ui,config}