import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getStatsApi } from '../api/dashboard'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { StatusBadge } from '../components/ui/Badge'
import { StatCardSkeleton, SkeletonRow } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { formatDate } from '../utils/formatters'
import { useAuthStore } from '../store/authStore'
import { TaskStatus } from '../types'
import { getMyOrgApi, regenerateInviteApi } from '../api/orgs'

const statusColors: Record<string, string> = {
  TODO: '#9ca3af', IN_PROGRESS: '#3b82f6', IN_REVIEW: '#f59e0b', DONE: '#22c55e',
}

const statusLabels: Record<string, string> = {
  TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', DONE: 'Done',
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['dashboard'], queryFn: getStatsApi })
  const queryClient = useQueryClient()
  const { data: org } = useQuery({ queryKey: ['org'], queryFn: getMyOrgApi })
  const regenMutation = useMutation({ mutationFn: regenerateInviteApi, onSuccess: (newOrg) => queryClient.setQueryData(['org'], newOrg) })

  const doneCount = data?.tasksByStatus.find(t => t.status === 'DONE')?.count ?? 0

  return (
    <div className="flex max-w-[1180px] flex-col gap-6">
      <div className="surface-card-strong px-5 py-5 md:px-6">
        <p className="page-kicker mb-2">Overview</p>
        <h1 className="page-title flex flex-wrap items-center gap-3">
          <span>{user?.name}</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{user?.role}</span>
        </h1>
        <p className="page-subtitle mt-2 max-w-2xl">Workspace updates in real-time across projects, tasks and team activity.</p>
        {org && (
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div className="text-slate-600">Org: <span className="font-medium text-slate-800">{org.name}</span></div>
            <div className="text-slate-600">Invite: <span className="font-mono ml-1 rounded bg-slate-100 px-2 py-1 text-xs">{org.inviteCode}</span></div>
            {user?.role === 'ADMIN' && (
              <button onClick={() => regenMutation.mutate()} disabled={regenMutation.status === 'pending'} className="ml-2 rounded bg-blue-600 px-3 py-1 text-xs text-white">{regenMutation.status === 'pending' ? '...' : 'Regenerate'}</button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          [1,2,3,4].map(i => <StatCardSkeleton key={i} />)
        ) : (
          <>
            {[
              { label: 'Projects', value: data?.totalProjects ?? 0, accent: 'bg-indigo-400' },
              { label: 'Total Tasks', value: data?.totalTasks ?? 0, accent: 'bg-blue-400' },
              { label: 'Overdue', value: data?.overdueCount ?? 0, accent: 'bg-rose-400' },
              { label: 'Done', value: doneCount, accent: 'bg-emerald-400' },
            ].map(card => (
              <div key={card.label} className="surface-card border border-slate-200/80 bg-white p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${card.accent}`} />
                  <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                </div>
                <p className="text-3xl font-semibold text-slate-900">{card.value}</p>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Tasks by status</h2>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
            </div>
          ) : data?.tasksByStatus.length ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.tasksByStatus.map(t => ({ ...t, label: statusLabels[t.status] }))}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  domain={[0, 'dataMax']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.tasksByStatus.map(t => (
                    <Cell key={t.status} fill={statusColors[t.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No task data yet" />
          )}
        </div>

        <div className="surface-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Recent activity</h2>
          {isLoading ? (
            <table className="w-full"><tbody>{[1,2,3].map(i => <SkeletonRow key={i} />)}</tbody></table>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="mb-3 text-sm text-slate-400">Failed to load</p>
              <button onClick={() => refetch()} className="text-xs font-medium text-blue-600 hover:underline">Retry</button>
            </div>
          ) : data?.recentActivity.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-2 text-left text-xs font-medium text-slate-400">Task</th>
                    <th className="pb-2 text-left text-xs font-medium text-slate-400">Project</th>
                    <th className="pb-2 text-left text-xs font-medium text-slate-400">Status</th>
                    <th className="pb-2 text-left text-xs font-medium text-slate-400">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentActivity.map((task, i) => (
                    <tr key={task.id} className={`${i % 2 === 0 ? 'bg-white/70' : 'bg-slate-50/70'} border-b border-slate-100`}>
                      <td className="max-w-[120px] truncate py-2.5 pr-3 font-medium text-slate-800">{task.title}</td>
                      <td className="py-2.5 pr-3 text-xs text-slate-500">{task.project?.name}</td>
                      <td className="py-2.5 pr-3"><StatusBadge status={task.status as TaskStatus} /></td>
                      <td className="whitespace-nowrap py-2.5 text-xs text-slate-500">{formatDate(task.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No recent activity" />
          )}
        </div>
      </div>
    </div>
  )
}