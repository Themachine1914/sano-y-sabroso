import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatRD } from '../lib/whatsapp'
import { Button } from './Button'

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    total,
    setQuantity,
    removeItem,
  } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-brand-900/35"
        onClick={closeCart}
      />
      <aside className="relative flex h-[100dvh] w-full max-w-lg flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-brand-100 px-4 py-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-brand-600/60 uppercase">
              Tu pedido
            </p>
            <h2 className="font-display text-lg font-bold text-brand-800">
              Carrito
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-brand-50"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-brand-600/70">Tu pedido está vacío.</p>
              <Button variant="secondary" className="mt-4" onClick={closeCart}>
                Ver menú
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map(({ dish, quantity }) => (
                <li
                  key={dish.id}
                  className="flex gap-3 rounded-2xl border border-brand-100 bg-white p-2.5"
                >
                  <img
                    src={dish.image}
                    alt=""
                    className="h-16 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-brand-900">
                      {dish.name}
                    </p>
                    <p className="text-xs text-brand-600/65">
                      {formatRD(dish.price)}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50"
                        onClick={() => setQuantity(dish.id, quantity - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-bold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white"
                        onClick={() => setQuantity(dish.id, quantity + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-brand-600/50 hover:text-red-600"
                        onClick={() => removeItem(dish.id)}
                        aria-label="Quitar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="safe-bottom border-t border-brand-100 bg-white px-4 py-4">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-brand-600/70">Total</span>
              <span className="font-display text-lg font-bold text-brand-800">
                {formatRD(total)}
              </span>
            </div>
            <Link to="/pedido" onClick={closeCart}>
              <Button variant="accent" fullWidth>
                Continuar pedido
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
