import { Minus, Plus } from 'lucide-react'
import type { Dish } from '../types'
import { useCart } from '../context/CartContext'
import { formatRD } from '../lib/whatsapp'

export function DishCard({
  dish,
  priority = false,
}: {
  dish: Dish
  priority?: boolean
}) {
  const { getQty, addItem, setQuantity } = useCart()
  const qty = getQty(dish.id)

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(6,41,92,0.08)] ring-1 ring-white">
        <img
          src={dish.image}
          alt={dish.name}
          width={480}
          height={600}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'low'}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-900/35 to-transparent" />
        <span className="absolute right-2.5 bottom-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy-800 shadow-sm">
          {formatRD(dish.price)}
        </span>
      </div>
      <div className="mt-3 space-y-1 px-0.5">
        <h3 className="text-sm leading-snug font-semibold text-navy-800">
          {dish.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted">
          {dish.description}
        </p>
        {qty === 0 ? (
          <button
            type="button"
            onClick={() => addItem(dish.id)}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-navy-800 py-2.5 text-sm font-semibold text-white shadow-sm shadow-navy-800/20 transition active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            Agregar
          </button>
        ) : (
          <div className="mt-2.5 flex items-center justify-between rounded-full bg-white px-1.5 py-1 shadow-sm ring-1 ring-line">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-warm text-navy-800"
              onClick={() => setQuantity(dish.id, qty - 1)}
            >
              <Minus className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <span className="text-sm font-semibold text-navy-800">{qty}</span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-white"
              onClick={() => setQuantity(dish.id, qty + 1)}
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
