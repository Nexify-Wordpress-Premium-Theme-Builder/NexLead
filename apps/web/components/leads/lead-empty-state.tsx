import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconUsers } from "@/components/ui/icons";

type LeadEmptyStateProps = {
  onCreate: () => void;
};

export function LeadEmptyState({ onCreate }: LeadEmptyStateProps) {
  return (
    <EmptyState
      title="Henüz lead eklenmedi"
      description="İlk potansiyel müşterinizi ekleyerek pipeline'ınızı oluşturun."
      icon={<IconUsers className="h-6 w-6" strokeWidth={2} />}
      action={
        <Button type="button" onClick={onCreate}>
          Yeni Lead Ekle
        </Button>
      }
    />
  );
}
