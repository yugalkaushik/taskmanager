import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllUsersApi, updateUserRoleApi } from '../api/users'
import Avatar from '../components/ui/Avatar'
import { SkeletonRow } from '../components/ui/Skeleton'
import { formatDate } from '../utils/formatters'

export default function Admin() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => getAllUsersApi() })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRoleApi(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="surface-card-strong px-5 py-5 md:px-6">
        <p className="page-kicker mb-2">Administration</p>
        <h1 className="page-title">User management</h1>
        <p className="page-subtitle mt-2">Manage access levels and maintain role structure across your workspace.</p>
      </div>

      <div className="table-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-head border-b border-slate-200/70">
              <tr>
                {['User', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3,4,5].map(i => <SkeletonRow key={i} />)
              ) : (
                data?.users.map((u, i) => (
                  <tr key={u.id} className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white/70' : 'bg-slate-50/70'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} size="sm" />
                        <span className="font-medium text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={e => roleMutation.mutate({ id: u.id, role: e.target.value })}
                        className="field-select !h-9 !min-h-9 !rounded-lg !px-2.5 !py-1 text-xs"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="MEMBER">MEMBER</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}