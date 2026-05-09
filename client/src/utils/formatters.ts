import type { Task } from '../types'

export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const getTaskDateLabel = (task: Pick<Task, 'status' | 'dueDate' | 'doneAt' | 'updatedAt'>): { label: string; date?: string | null } => {
  if (task.status === 'DONE') {
    return { label: 'Done on', date: task.doneAt ?? task.updatedAt }
  }
  return { label: 'Deadline', date: task.dueDate }
}

export const isOverdue = (date: string | null | undefined, status: string): boolean => {
  if (!date || status === 'DONE') return false
  return new Date(date) < new Date()
}

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-violet-100 text-violet-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-amber-100 text-amber-800',
    'bg-rose-100 text-rose-800',
    'bg-cyan-100 text-cyan-800',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export const statusLabel: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
}

export const priorityLabel: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}