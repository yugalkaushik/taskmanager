import { useState } from 'react'
import { Task, TaskStatus } from '../../types'
import { PriorityBadge } from '../ui/Badge'
import Avatar from '../ui/Avatar'
import Modal from '../ui/Modal'
import TaskForm from './TaskForm'
import { formatDate, getTaskDateLabel, isOverdue } from '../../utils/formatters'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTaskApi } from '../../api/tasks'
import { User } from '../../types'
import { useAuthStore } from '../../store/authStore'

const columnLabels: Record<TaskStatus, string> = {
  TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done',
}

interface Props {
  status: TaskStatus
  tasks: Task[]
  members: User[]
  projectId: string
}

export default function KanbanColumn({ status, tasks, members, projectId }: Props) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const qc = useQueryClient()
  const { user } = useAuthStore()

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateTaskApi>[1]) => updateTaskApi(editingTask!.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', projectId] })
      setEditingTask(null)
    },
  })

  return (
    <div className="board-column flex w-[18rem] shrink-0 flex-col">
      <div className="flex items-center justify-between border-b border-slate-200/70 px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">{columnLabels[status]}</span>
        <span className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">{tasks.length}</span>
      </div>
      <div className="flex min-h-[100px] flex-col gap-2 p-2">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => setEditingTask(task)}
            className="board-task flex cursor-pointer flex-col gap-2 p-3 transition-all"
          >
            <p className="text-sm font-semibold leading-snug text-slate-800">{task.title}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="flex items-center justify-between mt-1">
              {task.assignee ? (
                <Avatar name={task.assignee.name} size="sm" />
              ) : (
                <span className="text-xs text-slate-300">Unassigned</span>
              )}
              {(() => {
                const { label, date } = getTaskDateLabel(task)
                return (
                  <span className={`text-xs ${isOverdue(task.dueDate, task.status) ? 'font-medium text-rose-500' : 'text-slate-400'}`}>
                    {date ? `${label}: ${formatDate(date)}` : `${label}: —`}
                  </span>
                )
              })()}
            </div>
          </div>
        ))}
        {!tasks.length && (
          <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white/65 px-3 text-xs font-medium text-slate-400">
            Nothing here yet
          </div>
        )}
      </div>

      <Modal open={!!editingTask} onClose={() => setEditingTask(null)} title="Edit task">
        {editingTask && (
          <TaskForm
            statusOnly={user?.role === 'MEMBER'}
            onSubmit={(data) => updateMutation.mutate(
              user?.role === 'MEMBER'
                ? { status: data.status }
                : {
                    title: data.title ?? '',
                    description: data.description,
                    status: data.status,
                    priority: data.priority,
                    assigneeId: data.assigneeId || null,
                    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
                  }
            )}
            loading={updateMutation.isPending}
            members={members}
            defaultValues={{
              title: editingTask.title,
              description: editingTask.description ?? '',
              status: editingTask.status,
              priority: editingTask.priority,
              assigneeId: editingTask.assigneeId ?? '',
              dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
            }}
          />
        )}
      </Modal>
    </div>
  )
}