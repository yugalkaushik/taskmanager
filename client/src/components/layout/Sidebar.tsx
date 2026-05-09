import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'

interface Props { onClose?: () => void }

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
]

export default function Sidebar({ onClose }: Props) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()

  const logout = async () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <aside className="surface-card-strong flex h-full flex-col overflow-hidden">
      <div className="border-b border-slate-200/70 px-5 py-5">
        <div>
          <span className="block text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase">TaskManager</span>
          <span className="block text-xs text-slate-400">Team workspace</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3 py-4">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-pill flex items-center gap-3 px-4 py-3 text-sm font-medium ${isActive ? 'nav-pill-active' : 'hover:bg-white/70 hover:text-slate-900 hover:shadow-sm'}`
            }
          >
            <span className={`h-2 w-2 rounded-full ${link.to === '/dashboard' ? 'bg-blue-500' : link.to === '/projects' ? 'bg-teal-500' : 'bg-amber-500'}`} />
            {link.label}
          </NavLink>
        ))}
        {user?.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            onClick={onClose}
            className={({ isActive }) =>
              `nav-pill flex items-center gap-3 px-4 py-3 text-sm font-medium ${isActive ? 'nav-pill-active' : 'hover:bg-white/70 hover:text-slate-900 hover:shadow-sm'}`
            }
          >
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Admin
          </NavLink>
        )}
      </nav>

      <div className="border-t border-slate-200/70 px-4 py-4">
        {user && (
          <div className="mb-3 rounded-2xl border border-slate-200/70 bg-white/75 px-3 py-3 shadow-sm">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.role}</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start rounded-2xl border border-slate-200/60 bg-white/75 text-slate-600 hover:text-slate-900" onClick={logout}>
          Sign out
        </Button>
      </div>
    </aside>
  )
}