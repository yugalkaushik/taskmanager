import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasksApi, updateTaskApi, deleteTaskApi } from '../api/tasks'
import { getProjectsApi } from '../api/projects'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import TaskForm from '../components/tasks/TaskForm'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import { formatDate, getTaskDateLabel, isOverdue } from '../utils/formatters'
import { Task, TaskStatus, Priority } from '../types'
import { useAuthStore } from '../store/authStore'

const STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'QA',
  DONE: 'Done',
}

export default function Tasks() {
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const qc = useQueryClient()
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', statusFilter, priorityFilter, projectFilter],
    queryFn: () => getTasksApi({
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      projectId: projectFilter || undefined,
      page: 1,
      limit: 80,
    }),
  })

  const { data: projectsData } = useQuery({ queryKey: ['projects'], queryFn: getProjectsApi })

  const updateMutation = useMutation({
    mutationFn: (d: Parameters<typeof updateTaskApi>[1]) => updateTaskApi(editingTask!.id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setEditingTask(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const tasks = data?.tasks ?? []
  const columns = STATUS_ORDER.map(status => ({
    status,
    label: STATUS_LABELS[status],
    items: tasks.filter(task => task.status === status),
  }))

  return (
    <div className="flex max-w-[1280px] flex-col gap-6">
      <div className="surface-card-strong flex flex-col gap-4 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="page-kicker mb-2">Execution Hub</p>
            <h1 className="page-title">Team task board</h1>
            <p className="page-subtitle mt-2">Track every item from planning to done with a clear visual flow.</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: 'Total', value: tasks.length },
              { label: 'Done', value: columns.find(c => c.status === 'DONE')?.items.length ?? 0 },
              { label: 'In Review', value: columns.find(c => c.status === 'IN_REVIEW')?.items.length ?? 0 },
            ].map(chip => (
              <div key={chip.label} className="toolbar-chip min-w-[6rem] px-5 py-1.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{chip.label}</p>
                <p className="text-lg font-semibold leading-tight text-slate-800">{chip.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Status', value: statusFilter, setter: setStatusFilter, options: [['', 'All statuses'], ['TODO', 'To Do'], ['IN_PROGRESS', 'In Progress'], ['IN_REVIEW', 'In Review'], ['DONE', 'Done']] },
            { label: 'Priority', value: priorityFilter, setter: setPriorityFilter, options: [['', 'All priorities'], ['LOW', 'Low'], ['MEDIUM', 'Medium'], ['HIGH', 'High'], ['URGENT', 'Urgent']] },
          ].map(f => (
            <select
              key={f.label}
              value={f.value}
              onChange={e => f.setter(e.target.value)}
              className="field-select !h-10 !min-h-10 !w-auto !min-w-[11rem] !rounded-lg !px-3 !py-2"
            >
              {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="field-select !h-10 !min-h-10 !w-auto !min-w-[12rem] !rounded-lg !px-3 !py-2"
          >
            <option value="">All projects</option>
            {projectsData?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : tasks.length ? (
        <div className="board-shell">
          {columns.map(column => (
            <section key={column.status} className="board-column flex flex-col">
              <header className="flex items-center justify-between border-b border-slate-200/60 px-3 py-3">
                <h2 className="text-sm font-semibold text-slate-800">{column.label}</h2>
                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-500">{column.items.length}</span>
              </header>
              <div className="flex flex-1 flex-col gap-2 p-2">
                {column.items.map(task => (
                  <article
                    key={task.id}
                    onClick={() => setEditingTask(task)}
                    className="board-task cursor-pointer p-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800">{task.title}</p>
                      {user?.role !== 'MEMBER' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(task.id) }}
                          className="text-xs font-medium text-rose-400 transition-colors hover:text-rose-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="mt-2 truncate text-xs text-slate-400">{task.project?.name ?? 'No project'}</p>
                    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                      <PriorityBadge priority={task.priority as Priority} />
                      <StatusBadge status={task.status as TaskStatus} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      {task.assignee ? <Avatar name={task.assignee.name} size="sm" /> : <span className="text-xs text-slate-300">Unassigned</span>}
                      <span className={`text-xs font-medium ${isOverdue(task.dueDate, task.status) ? 'text-rose-500' : 'text-slate-400'}`}>
                        {(() => {
                          const { label, date } = getTaskDateLabel(task)
                          return date ? `${label}: ${formatDate(date)}` : `${label}: —`
                        })()}
                      </span>
                    </div>
                  </article>
                ))}
                {!column.items.length && (
                  <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white/65 px-3 text-xs font-medium text-slate-400">
                    No tasks in {column.label.toLowerCase()}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState message="No tasks found for current filters" />
      )}

      <Modal open={!!editingTask} onClose={() => setEditingTask(null)} title="Edit task">
        {editingTask && (
          <TaskForm
            statusOnly={user?.role === 'MEMBER'}
            onSubmit={d => updateMutation.mutate(
              user?.role === 'MEMBER'
                ? { status: d.status }
                : {
                    title: d.title ?? '',
                    description: d.description,
                    status: d.status,
                    priority: d.priority,
                    assigneeId: d.assigneeId || null,
                    dueDate: d.dueDate ? new Date(d.dueDate).toISOString() : null,
                  }
            )}
            loading={updateMutation.isPending}
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