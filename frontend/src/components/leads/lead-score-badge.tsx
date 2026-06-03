import { Badge } from "@/components/ui/badge";

export function LeadScoreBadge({ score }: { score: number }) {
  const variant = score >= 80 ? "success" : score >= 60 ? "warning" : "default";
  return <Badge variant={variant}>{score}</Badge>;
}
