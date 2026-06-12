import { Button } from "@/components/ui/button";

type WebsiteEmptyStateProps = {
  onCreate: () => void;
};

export function WebsiteEmptyState({ onCreate }: WebsiteEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center shadow-soft">
      <p className="text-base font-medium text-text-primary">Henüz web site eklenmedi.</p>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        İlk web sitenizi ekleyerek analiz sürecini başlatın.
      </p>
      <Button type="button" className="mt-6" onClick={onCreate}>
        Yeni Web Site Ekle
      </Button>
    </div>
  );
}
