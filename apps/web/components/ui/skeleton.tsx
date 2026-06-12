type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`nx-skeleton ${className}`} aria-hidden="true" />;
}
