import type { ActivityItem } from "@/types/dashboard";

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="text-sm text-text-secondary">
          {item.title}
        </li>
      ))}
    </ul>
  );
}
