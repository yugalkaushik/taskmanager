import { useNavigate } from 'react-router-dom'
import { Project } from '../../types'

interface Props { project: Project }

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate()

  return (
    <div
      className="surface-card group flex cursor-pointer flex-col gap-3 p-5 transition-all hover:-translate-y-0.5"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-snug text-slate-900">{project.name}</h3>
        <span className={`shrink-0 rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
          project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {project.status === 'ACTIVE' ? 'Active' : 'Archived'}
        </span>
      </div>
      {project.description && (
        <p className="line-clamp-2 text-sm text-slate-500">{project.description}</p>
      )}
      <div className="mt-auto flex items-center gap-4 border-t border-slate-200/70 pt-2 text-xs text-slate-400">
        <span>{project._count?.members ?? 0} members</span>
        <span>{project._count?.tasks ?? 0} tasks</span>
        <span className="ml-auto truncate text-slate-500">{project.owner?.name}</span>
      </div>
    </div>
  )
}