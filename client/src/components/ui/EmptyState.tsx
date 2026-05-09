import type { ReactNode } from 'react'

interface Props { message: string; action?: ReactNode }

export default function EmptyState({ message, action }: Props) {
  return (
    <div className="empty-state-shell flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
        <span className="h-6 w-6 rounded-xl border border-current/20 bg-white/70" />
      </div>
      <div className="max-w-sm">
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
      {action}
    </div>
  )
}