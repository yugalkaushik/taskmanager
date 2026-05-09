interface Props { className?: string }

export function Skeleton({ className = '' }: Props) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="surface-card flex flex-col gap-3 p-5">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-slate-200/60">
      {[1, 2, 3, 4, 5].map(i => (
        <td key={i} className="px-4 py-3"><Skeleton className="h-3 w-full" /></td>
      ))}
    </tr>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="surface-card p-5">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}