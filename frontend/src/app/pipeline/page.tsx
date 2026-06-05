import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { PageHeader } from "@/components/layout/page-header";

export default function PipelinePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        className="animate-fade-up"
        title="Pipeline"
        description="Track every lead from discovery to meeting and close."
        action={
          <button type="button" className="btn-campaign">
            Add Stage
          </button>
        }
      />
      <PipelineBoard />
    </div>
  );
}
