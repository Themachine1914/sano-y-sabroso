import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bike,
  ClipboardList,
  Home,
  LogOut,
  Store,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { BrandMark } from '../components/BrandMark'

const tabs = [
  { to: '/admin', label: 'Inicio', icon: Home, end: true },
  { to: '/admin/menu', label: 'Menú', icon: UtensilsCrossed },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/entregas', label: 'Entregas', icon: Bike },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
]

export function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <header className="safe-top sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-2.5">
          <BrandMark size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-tight text-navy-800">
              Panel del dueño
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex h-9 items-center gap-1 rounded-full bg-white/80 px-2.5 text-xs font-medium text-muted ring-1 ring-line hover:text-navy-800"
          >
            <Store className="h-3.5 w-3.5" strokeWidth={1.75} />
            Sitio
          </button>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-white/80"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto px-5 pt-6 pb-28">
        <Outlet />
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1.5">
          {tabs.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex min-h-[48px] flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition',
                  isActive ? 'text-navy-800' : 'text-muted',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
