"use client";

import { useState } from "react";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function PipelinePage() {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [extraStages, setExtraStages] = useState<{ id: string; label: string }[]>([]);

  const handleAddStage = async () => {
    if (!newStageName.trim()) {
      toast.warning("Stage name required", "Please enter a stage name.");
      return;
    }

    setIsSubmitting(true);
    await wait(getRandomDelay());
    const label = newStageName.trim();
    const id = `${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    setExtraStages((current) => [...current, { id, label }]);
    setNewStageName("");
    setIsSubmitting(false);
    setIsModalOpen(false);
    toast.success("Stage added", `${label} stage has been added to the board.`);
  };

  return (
    <div className="min-w-0 space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Pipeline"
        description="Track every lead from discovery to meeting and close."
        action={
          <button type="button" className="btn-campaign" onClick={() => setIsModalOpen(true)}>
            Add Stage
          </button>
        }
      />
      <PipelineBoard extraStages={extraStages} />

      <Modal
        open={isModalOpen}
        onClose={() => (isSubmitting ? undefined : setIsModalOpen(false))}
        title="Add Custom Stage"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddStage}
              disabled={isSubmitting}
              className="btn-campaign inline-flex h-10 items-center justify-center px-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LoadingButtonState isLoading={isSubmitting} loadingText="Adding...">
                Add Stage
              </LoadingButtonState>
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-muted">Stage Name</label>
            <Input
              value={newStageName}
              onChange={(event) => setNewStageName(event.target.value)}
              placeholder="Negotiation"
            />
          </div>
          <p className="text-xs text-text-muted">
            Custom stages are added for demo display and appear after default pipeline columns.
          </p>
        </div>
      </Modal>
    </div>
  );
}
