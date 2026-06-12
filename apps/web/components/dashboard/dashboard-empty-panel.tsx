import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconGlobe, IconUsers } from "@/components/ui/icons";

export function DashboardEmptyPanel() {
  return (
    <Card padding="lg">
      <EmptyState
        title="Henüz veri yok"
        description="İlk lead'inizi ekleyin veya bir web sitesi analizi başlatarak dashboard'u doldurun."
        icon={<IconUsers className="h-6 w-6" strokeWidth={2} />}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/dashboard/leads">
              <Button type="button">Lead Ekle</Button>
            </Link>
            <Link href="/dashboard/websites">
              <Button type="button" variant="secondary">
                <IconGlobe className="h-4 w-4" strokeWidth={2} />
                Analiz Başlat
              </Button>
            </Link>
          </div>
        }
      />
    </Card>
  );
}
