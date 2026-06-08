# NexLead

AI destekli müşteri bulma ve web sitesi denetim SaaS platformu.

## Gereksinimler

- Node.js >= 20
- pnpm >= 9

## Kurulum

```bash
pnpm install
```

## Geliştirme

Tüm uygulamaları paralel başlatır (web: 3000, api: 4000):

```bash
pnpm dev
```

Tek uygulama:

```bash
pnpm --filter @nexlead/web dev
pnpm --filter @nexlead/api dev
```

## Build

```bash
pnpm build
```

## Production

```bash
pnpm start
```

## Lint & Format

```bash
pnpm lint
pnpm format
pnpm format:check
```

## Sağlık Kontrolü

- Web: `http://localhost:3000/api/health`
- API: `http://localhost:4000/health`

## Monorepo Yapısı

| Paket | Açıklama |
|-------|----------|
| `apps/web` | Next.js frontend |
| `apps/api` | Node.js HTTP API |
| `packages/types` | Paylaşılan TypeScript tipleri |
| `packages/utils` | Paylaşılan yardımcı fonksiyonlar |
| `packages/ui` | Paylaşılan UI bileşenleri |
| `packages/config` | ESLint, TypeScript, Prettier config |

Detaylı klasör yapısı: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
