# NexLead — Proje Yapısı

Bu dosya monorepo klasör ağacının referans kopyasıdır.

```
nexlead/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Backend API
├── packages/
│   ├── ui/           # Paylaşılan UI bileşenleri
│   ├── config/       # ESLint, TypeScript, Prettier
│   ├── types/        # Paylaşılan TypeScript tipleri
│   └── utils/        # Paylaşılan yardımcı fonksiyonlar
├── database/         # Supabase ve şema dokümantasyonu
├── docs/             # Mimari ve ürün dokümantasyonu
├── scripts/          # Kurulum, veritabanı ve deployment scriptleri
├── tooling/          # Cursor ve GitHub şablonları
├── public/           # Statik marka ve görsel dosyaları
├── tests/            # Monorepo geneli testler
└── .github/          # CI/CD workflow tanımları
```

Her ana modülün kendi `README.md` dosyası bulunur.
