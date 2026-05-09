import { TaskStatus, Priority } from '../../types'

const statusStyles: Record<TaskStatus, string> = {
  TODO: 'border-slate-200 bg-slate-100/80 text-slate-600',
  IN_PROGRESS: 'border-blue-200 bg-blue-50 text-blue-700',
  IN_REVIEW: 'border-amber-200 bg-amber-50 text-amber-700',
  DONE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const priorityStyles: Record<Priority, string> = {
  LOW: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  MEDIUM: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  HIGH: 'border-orange-200 bg-orange-50 text-orange-700',
  URGENT: 'border-rose-200 bg-rose-50 text-rose-700',
}

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done',
}

const priorityLabels: Record<Priority, string> = {
  LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent',
}

interface StatusBadgeProps { status: TaskStatus }
interface PriorityBadgeProps { priority: Priority }

const badgeBase = 'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap'

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${badgeBase} ${statusStyles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {statusLabels[status]}
    </span>
  )
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`${badgeBase} ${priorityStyles[priority]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {priorityLabels[priority]}
    </span>
  )
}

export function RoleBadge({ role }: { role: string }) {
  const s = role === 'ADMIN' ? 'border-blue-200 bg-blue-50 text-blue-700' : role === 'MANAGER' ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-slate-100 text-slate-600'
  return <span className={`${badgeBase} ${s}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{role}</span>
}