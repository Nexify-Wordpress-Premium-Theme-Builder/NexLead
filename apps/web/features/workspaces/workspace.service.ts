import { requireWorkspace } from "@/lib/workspace/require-workspace";

export type ActiveWorkspace = {
  id: string;
  name: string;
};

export async function getActiveWorkspace(): Promise<ActiveWorkspace | null> {
  const context = await requireWorkspace();

  if (!context) {
    return null;
  }

  return {
    id: context.workspaceId,
    name: context.workspaceName ?? "Çalışma Alanı",
  };
}
