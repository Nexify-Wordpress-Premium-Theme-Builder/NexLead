import { cn } from "@/lib/cn";

export interface AvatarProps {
  name: string;
  src?: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, src, className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatar src may be external; optimize in UI phase
      <img
        src={src}
        alt={name}
        className={cn("h-9 w-9 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary",
        className,
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
