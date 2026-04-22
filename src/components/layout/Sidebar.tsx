import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Car, FileText, ClipboardList,
  Package, Settings, LogOut, Wrench, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',    roles: ['admin'] },
  { to: '/orders',     icon: ClipboardList,   label: 'Órdenes',      roles: ['admin','mecanico'] },
  { to: '/quotes',     icon: FileText,        label: 'Cotizaciones', roles: ['admin','mecanico'] },
  { to: '/clients',    icon: Users,           label: 'Clientes',     roles: ['admin','mecanico'] },
  { to: '/vehicles',   icon: Car,             label: 'Vehículos',    roles: ['admin','mecanico'] },
  { to: '/repuestos',  icon: Package,         label: 'Repuestos',    roles: ['admin'] },
]

export const Sidebar = () => {
  const { user, logout } = useAuthStore()
  const navigate         = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const links = NAV.filter(n => n.roles.includes(user?.role || ''))

  return (
    <aside className="w-60 shrink-0 bg-surface-1 border-r border-line flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-glow-blue">
            <Wrench size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-none">AutoTaller</p>
            <p className="text-xs text-ink-faint mt-0.5">Sistema de gestión</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link group ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={17} className="shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-line space-y-0.5">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-ink-faint">Sesión activa</p>
          <p className="text-sm text-ink font-medium truncate">{user?.email}</p>
          <span className="text-xs text-brand-glow capitalize">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="nav-link w-full text-accent-red hover:text-accent-red hover:bg-accent-red/10">
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
