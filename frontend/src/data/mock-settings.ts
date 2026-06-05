export const mockProfileSettings = {
  name: "John Carter",
  email: "john@acmemarketing.com",
  role: "Hesap Direktörü",
};

export const mockWorkspaceSettings = {
  workspaceName: "Acme Marketing",
  companyWebsite: "https://acmemarketing.com",
  industryFocus: "B2B SaaS ve Profesyonel Hizmetler",
  teamSize: "11–25",
};

export const mockOutreachSettings = {
  defaultSenderName: "John Carter",
  signature: "John Carter\nHesap Direktörü · Acme Marketing",
  tonePreference: "Profesyonel",
  ctaPreference: "Yumuşak rica",
};

export const mockIntegrations = [
  {
    id: "email",
    name: "E-posta Sağlayıcısı",
    description: "İletişim gönderimi için Gmail veya Outlook bağlayın.",
    connected: true,
  },
  {
    id: "calendar",
    name: "Google Takvim",
    description: "Görüşmeleri ve uygunluk durumunu senkronize edin.",
    connected: true,
  },
  {
    id: "leads",
    name: "Müşteri Kaynak Araçları",
    description: "Apollo, LinkedIn ve CSV üzerinden müşteri aktarın.",
    connected: false,
  },
  {
    id: "ai",
    name: "Yapay Zeka Sağlayıcısı",
    description: "Mesaj kişiselleştirme için yapay zeka modelini yapılandırın.",
    connected: true,
  },
];

export const mockBillingSettings = {
  plan: "Büyüme Planı",
  usage: "2.482 / 5.000 müşteri",
  renewalDate: "15 Haziran 2026",
};

export const mockSettingsTabs = [
  "Profil",
  "Çalışma Alanı",
  "İletişim",
  "Entegrasyonlar",
  "Faturalama",
] as const;
