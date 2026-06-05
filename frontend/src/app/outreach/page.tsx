import { Suspense } from "react";
import { OutreachPageContent } from "@/components/outreach/outreach-page-content";

export default function OutreachPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-fade-up space-y-5">
          <div className="h-20 rounded-[18px] border border-border-soft bg-surface/80" />
          <div className="h-96 rounded-[18px] border border-border-soft bg-surface/80" />
        </div>
      }
    >
      <OutreachPageContent />
    </Suspense>
  );
}
