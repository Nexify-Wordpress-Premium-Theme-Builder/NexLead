"use client";

import { DashboardUnavailable } from "@/components/layout/dashboard-unavailable";

export default function DashboardGroupError() {
  return (
    <DashboardUnavailable
      title="Dashboard yüklenemedi"
      description="Veri alınırken bir sorun oluştu. Tekrar deneyin veya giriş sayfasına dönün."
    />
  );
}
