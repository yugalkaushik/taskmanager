import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjectApi, addMemberApi, removeMemberApi } from '../api/projects'
import { createTaskApi } from '../api/tasks'
import { getAllUsersApi } from '../api/users'
import KanbanColumn from '../components/tasks/KanbanColumn'
import TaskForm from '../components/tasks/TaskForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import { RoleBadge } from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { useAuthStore } from '../store/authStore'
import { TaskStatus, User } from '../types'

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [tab, setTab] = useState<'tasks' | 'members'>('tasks')
  const [taskModal, setTaskModal] = useState(false)
  const [addMemberEmail, setAddMemberEmail] = useState('')

  const { data: project, isLoading } = useQuery({ queryKey: ['project', id], queryFn: () => getProjectApi(id!) })
  const { data: allUsersData } = useQuery({ queryKey: ['users'], queryFn: () => getAllUsersApi(), enabled: user?.role === 'ADMIN' })

  const createTaskMutation = useMutation({
    mutationFn: (data: Parameters<typeof createTaskApi>[0]) => createTaskApi({ ...data, projectId: id! }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['project', id] }); setTaskModal(false) },
  })

  const addMemberMutation = useMutation({
    mutationFn: (userId: string) => addMemberApi(id!, userId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['project', id] }); setAddMemberEmail('') },
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeMemberApi(id!, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project', id] }),
  })

  if (isLoading) return <div className="flex justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" /></div>
  if (!project) return <EmptyState message="Project not found" />

  const members = project.members?.map(m => m.user as User) ?? []
  const isOwnerOrAdmin = user?.role === 'ADMIN' || project.ownerId === user?.id

  const handleAddMember = () => {
    const found = allUsersData?.users.find(u => u.email === addMemberEmail.trim())
    if (found) addMemberMutation.mutate(found.id)
  }

  return (
    <div className="flex max-w-[1280px] flex-col gap-6">
      <div className="surface-card-strong flex flex-wrap items-start justify-between gap-4 px-5 py-5 md:px-6">
        <div className="max-w-2xl">
          <p className="page-kicker mb-2">Project Space</p>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="page-title">{project.name}</h1>
            <span className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {project.status === 'ACTIVE' ? 'Active' : 'Archived'}
            </span>
          </div>
          {project.description && <p className="page-subtitle">{project.description}</p>}
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Owned by {project.owner?.name}</p>
        </div>
        <Button onClick={() => setTaskModal(true)}>Add task</Button>
      </div>

      <div className="surface-card flex w-fit gap-1 p-1">
        {(['tasks', 'members'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${
              tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'tasks' && (
        <div className="board-shell">
          {STATUSES.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={(project.tasks ?? []).filter(t => t.status === status)}
              members={members}
              projectId={id!}
            />
          ))}
        </div>
      )}

      {tab === 'members' && (
        <div className="surface-card flex max-w-3xl flex-col gap-4 p-5">
          {isOwnerOrAdmin && (
            <div className="flex gap-2">
              <input
                value={addMemberEmail}
                onChange={e => setAddMemberEmail(e.target.value)}
                placeholder="User email to add"
                className="field-input"
              />
              <Button onClick={handleAddMember} loading={addMemberMutation.isPending} size="sm">Add</Button>
            </div>
          )}
          {project.members?.length ? (
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70">
              {project.members.map(m => (
                <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar name={m.user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{m.user.name}</p>
                    <p className="text-xs text-slate-500">{m.user.email}</p>
                  </div>
                  <RoleBadge role={m.user.role} />
                  {isOwnerOrAdmin && m.user.id !== project.ownerId && (m.user.role !== 'ADMIN' || user?.role === 'ADMIN') && (
                    <button
                      onClick={() => removeMemberMutation.mutate(m.user.id)}
                      className="text-xs text-rose-400 transition-colors hover:text-rose-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No members yet" />
          )}
        </div>
      )}

      <Modal open={taskModal} onClose={() => setTaskModal(false)} title="New task">
        <TaskForm
          onSubmit={d => createTaskMutation.mutate({
            title: d.title ?? '',
            description: d.description,
            status: d.status,
            priority: d.priority,
            projectId: id!,
            dueDate: d.dueDate ? new Date(d.dueDate).toISOString() : undefined,
            assigneeId: d.assigneeId || undefined,
          })}
          loading={createTaskMutation.isPending}
          members={members}
        />
      </Modal>
    </div>
  )
}