import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, FileText,
  Users, Car, Package, LogOut, Wrench, UserCog,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/orders',     icon: ClipboardList,   label: 'Órdenes' },
  { to: '/quotes',     icon: FileText,        label: 'Cotizaciones' },
  { to: '/clients',    icon: Users,           label: 'Clientes' },
  { to: '/vehicles',   icon: Car,             label: 'Vehículos' },
  { to: '/repuestos',  icon: Package,         label: 'Repuestos' },
]

const ADMIN_NAV = [
  { to: '/users', icon: UserCog, label: 'Usuarios' },
]

export const Sidebar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-surface-1 border-r border-line h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center">
            <Wrench size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-none">AutoTaller</p>
            <p className="text-[10px] text-ink-faint mt-0.5">Sistema de gestión</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-brand text-white font-medium'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-3'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-[10px] uppercase tracking-widest text-ink-faint font-medium">Admin</p>
            </div>
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-brand text-white font-medium'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-3'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-line">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-brand/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-brand">
              {user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink truncate">{user?.email}</p>
            <p className="text-[10px] text-ink-faint capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-ink-muted hover:text-accent-red hover:bg-accent-red/10 rounded-xl transition-all"
        >
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}