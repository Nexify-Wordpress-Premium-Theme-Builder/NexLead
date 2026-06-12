import { Button } from "@/components/ui/button";

type LeadEmptyStateProps = {
  onCreate: () => void;
};

export function LeadEmptyState({ onCreate }: LeadEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center shadow-soft">
      <p className="text-base font-medium text-text-primary">Henüz lead eklenmedi.</p>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        İlk potansiyel müşterinizi ekleyerek başlayın.
      </p>
      <Button type="button" className="mt-6" onClick={onCreate}>
        Yeni Lead Ekle
      </Button>
    </div>
  );
}
