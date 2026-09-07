import { NavLink, Outlet } from 'react-router-dom'
import { Home, Lock, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { CartDrawer } from '../components/CartDrawer'
import { BrandMark } from '../components/BrandMark'

const tabs: Array<{
  to: string
  label: string
  icon: typeof Home
  end?: boolean
}> = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/menu', label: 'Menú', icon: UtensilsCrossed },
  { to: '/pedido', label: 'Pedido', icon: ShoppingBag },
  { to: '/admin', label: 'Dueño', icon: Lock },
]

export function PublicLayout() {
  const { itemCount, openCart } = useCart()

  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-lg flex-col">
      <header className="safe-top sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-3">
          <NavLink to="/" className="flex items-center" aria-label="Sano & Sabroso">
            <BrandMark size="md" />
          </NavLink>
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-navy-800 shadow-sm shadow-navy-800/5 ring-1 ring-line"
            aria-label="Ver pedido"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto px-5 pt-6 pb-28">
        <Outlet />
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-lg grid-cols-4 px-1 pt-1.5">
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
              <span className="relative">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                {to === '/pedido' && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-0.5 text-[9px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <CartDrawer />
    </div>
  )
}
