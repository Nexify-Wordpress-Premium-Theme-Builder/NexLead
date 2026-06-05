"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { panelClass } from "@/lib/panel";
import { ROUTES } from "@/lib/routes";
import { PIPELINE_STAGE_ORDER, type PipelineStageId } from "@/types/pipeline";

const stageLabels: Record<PipelineStageId, string> = {
  new: "New",
  audited: "Audited",
  message_ready: "Message Ready",
  sent: "Sent",
  replied: "Replied",
  meeting: "Meeting",
  closed: "Closed",
};

const columnDelays = [
  "animation-delay-200",
  "animation-delay-250",
  "animation-delay-300",
  "animation-delay-350",
  "animation-delay-400",
  "animation-delay-450",
  "animation-delay-500",
] as const;

const cardDelays = [
  "animation-delay-250",
  "animation-delay-300",
  "animation-delay-350",
] as const;

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export interface PipelineBoardProps {
  extraStages?: { id: string; label: string }[];
}

export function PipelineBoard({ extraStages = [] }: PipelineBoardProps) {
  const router = useRouter();
  const toast = useToast();
  const {
    pipelineCards,
    movePipelineCard,
    movePipelineBack,
    markPipelineMeeting,
    closePipelineCard,
    addActivity,
  } = useDemoData();
  const [busyCardAction, setBusyCardAction] = useState<string | null>(null);

  const stageColumns = useMemo(() => {
    const grouped = new Map<string, typeof pipelineCards>();
    for (const stageId of PIPELINE_STAGE_ORDER) {
      grouped.set(stageId, pipelineCards.filter((card) => card.stageId === stageId));
    }
    for (const extraStage of extraStages) {
      grouped.set(extraStage.id, []);
    }

    return [
      ...PIPELINE_STAGE_ORDER.map((stageId) => ({
        id: stageId,
        label: stageLabels[stageId],
        cards: grouped.get(stageId) ?? [],
      })),
      ...extraStages.map((stage) => ({
        id: stage.id,
        label: stage.label,
        cards: grouped.get(stage.id) ?? [],
      })),
    ];
  }, [extraStages, pipelineCards]);

  const runCardAction = async (
    cardId: string,
    label: string,
    action: () => void,
    activityMessage: string,
  ) => {
    setBusyCardAction(`${cardId}-${label}`);
    await wait(getRandomDelay());
    action();
    addActivity({
      type: "outreach",
      message: activityMessage,
    });
    setBusyCardAction(null);
  };

  const moveNext = (cardId: string) => {
    const card = pipelineCards.find((item) => item.id === cardId);
    if (!card) return;
    const currentIndex = PIPELINE_STAGE_ORDER.indexOf(card.stageId);
    if (currentIndex < 0 || currentIndex >= PIPELINE_STAGE_ORDER.length - 1) {
      toast.info("Final stage reached", "This lead is already at the last stage.");
      return;
    }
    const nextStage = PIPELINE_STAGE_ORDER[currentIndex + 1];
    void runCardAction(
      cardId,
      "next",
      () => movePipelineCard(cardId, nextStage),
      `${card.company} moved to ${stageLabels[nextStage]}`,
    );
  };

  const moveBack = (cardId: string) => {
    const card = pipelineCards.find((item) => item.id === cardId);
    if (!card || card.stageId === "new") {
      toast.info("Already at first stage", "This lead cannot move further back.");
      return;
    }
    void runCardAction(
      cardId,
      "back",
      () => movePipelineBack(cardId),
      `${card.company} moved back in pipeline`,
    );
  };

  const moveToMeeting = (cardId: string) => {
    const card = pipelineCards.find((item) => item.id === cardId);
    if (!card) return;
    void runCardAction(
      cardId,
      "meeting",
      () => markPipelineMeeting(cardId),
      `Meeting stage set for ${card.company}`,
    );
  };

  const closeCard = (cardId: string) => {
    const card = pipelineCards.find((item) => item.id === cardId);
    if (!card) return;
    void runCardAction(cardId, "close", () => closePipelineCard(cardId), `${card.company} was closed`);
  };

  return (
    <div
      className={cn(
        panelClass("w-full min-w-0 overflow-hidden p-4 md:p-5"),
        "animate-fade-up animation-delay-200",
      )}
    >
      <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain scroll-smooth lg:overflow-x-visible">
        <div className="grid w-max min-w-full auto-cols-[240px] grid-flow-col gap-3 lg:w-full lg:grid-flow-row lg:grid-cols-7">
          {stageColumns.map((column, colIndex) => (
            <div
              key={column.id}
              className={cn(
                "min-w-0 rounded-[18px] border border-border-soft bg-surface-muted/50 p-3",
                "animate-fade-up",
                columnDelays[colIndex % columnDelays.length],
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-2 px-0.5">
                <h4 className="truncate text-[13px] font-semibold text-text-primary">{column.label}</h4>
                <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-text-muted">
                  {column.cards.length}
                </span>
              </div>
              <div className="space-y-2">
                {column.cards.map((card, cardIndex) => (
                  <div
                    key={card.id}
                    className={cn(
                      panelClass("min-w-0 cursor-pointer p-3"),
                      "animate-fade-up-row",
                      cardDelays[cardIndex % cardDelays.length],
                    )}
                    onClick={() =>
                      router.push(card.leadId ? ROUTES.app.leadDetail(card.leadId) : ROUTES.app.leads)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        router.push(
                          card.leadId ? ROUTES.app.leadDetail(card.leadId) : ROUTES.app.leads,
                        );
                      }
                    }}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold text-text-primary">{card.company}</p>
                      <Badge variant="default" className="shrink-0">
                        {card.badge}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-text-muted">{card.industry}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-soft text-[10px] font-bold text-green">
                        {card.score}
                      </span>
                      <span className="truncate text-[11px] font-semibold text-primary">{card.nextAction}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-1.5" onClick={(event) => event.stopPropagation()}>
                      <button
                        type="button"
                        className="rounded-md border border-border px-2 py-1 text-[11px] font-medium text-text-secondary hover:bg-surface"
                        onClick={() => moveBack(card.id)}
                        disabled={busyCardAction === `${card.id}-back`}
                      >
                        <LoadingButtonState
                          isLoading={busyCardAction === `${card.id}-back`}
                          loadingText="..."
                        >
                          Back
                        </LoadingButtonState>
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-primary/20 bg-primary-soft/60 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary-soft"
                        onClick={() => moveNext(card.id)}
                        disabled={busyCardAction === `${card.id}-next`}
                      >
                        <LoadingButtonState
                          isLoading={busyCardAction === `${card.id}-next`}
                          loadingText="..."
                        >
                          Next
                        </LoadingButtonState>
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-border px-2 py-1 text-[11px] font-medium text-text-secondary hover:bg-surface"
                        onClick={() => moveToMeeting(card.id)}
                        disabled={busyCardAction === `${card.id}-meeting`}
                      >
                        <LoadingButtonState
                          isLoading={busyCardAction === `${card.id}-meeting`}
                          loadingText="..."
                        >
                          Meeting
                        </LoadingButtonState>
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-red/30 bg-red-soft px-2 py-1 text-[11px] font-semibold text-red hover:bg-red-soft/80"
                        onClick={() => closeCard(card.id)}
                        disabled={busyCardAction === `${card.id}-close`}
                      >
                        <LoadingButtonState
                          isLoading={busyCardAction === `${card.id}-close`}
                          loadingText="..."
                        >
                          Close
                        </LoadingButtonState>
                      </button>
                    </div>
                  </div>
                ))}
                {column.cards.length === 0 && (
                  <p className="px-1 py-4 text-center text-xs text-text-muted">No leads</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
