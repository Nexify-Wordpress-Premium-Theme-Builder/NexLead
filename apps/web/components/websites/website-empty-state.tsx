import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconGlobe } from "@/components/ui/icons";

type WebsiteEmptyStateProps = {
  onCreate: () => void;
};

export function WebsiteEmptyState({ onCreate }: WebsiteEmptyStateProps) {
  return (
    <EmptyState
      title="Henüz web site eklenmedi"
      description="İlk web sitenizi ekleyerek analiz sürecini başlatın."
      icon={<IconGlobe size={24} />}
      action={
        <Button type="button" onClick={onCreate}>
          Yeni Web Site Ekle
        </Button>
      }
    />
  );
}
