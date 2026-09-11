import { useMemo, useState } from 'react'
import { ChevronRight, MessageCircle } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '../types'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/Button'
import {
  buildOrderStatusMessage,
  formatPhone,
  formatRD,
  formatTime,
  openWhatsApp,
} from '../lib/whatsapp'

const filters: Array<{ id: 'todos' | OrderStatus; label: string }> = [
  { id: 'todos', label: 'Todos' },
  ...ORDER_STATUS_FLOW.map((s) => ({ id: s, label: ORDER_STATUS_LABELS[s] })),
]

export function OrdersPage() {
  const { orders, updateOrderStatus } = useApp()
  const [filter, setFilter] = useState<'todos' | OrderStatus>('todos')

  const filtered = useMemo(() => {
    if (filter === 'todos') return orders
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  function nextStatus(current: OrderStatus): OrderStatus | null {
    const idx = ORDER_STATUS_FLOW.indexOf(current)
    if (idx < 0 || idx >= ORDER_STATUS_FLOW.length - 1) return null
    return ORDER_STATUS_FLOW[idx + 1]
  }

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === f.id
                ? 'bg-brand-600 text-white'
                : 'bg-white text-brand-700 border border-brand-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const next = nextStatus(order.status)
            return (
              <article
                key={order.id}
                className="rounded-3xl border border-brand-100 bg-white/85 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-brand-900">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-brand-600/65">
                      {order.id} · {formatTime(order.createdAt)} ·{' '}
                      {formatPhone(order.customerPhone)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <ul className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <li
                      key={`${order.id}-${item.dishId}`}
                      className="text-sm text-brand-800"
                    >
                      {item.quantity}× {item.name}
                    </li>
                  ))}
                </ul>

                <p className="mt-2 text-xs text-brand-600/70">{order.address}</p>
                <p className="mt-1 text-sm font-bold text-brand-700">
                  {formatRD(order.total)} ·{' '}
                  {order.paymentMethod === 'efectivo'
                    ? 'Efectivo'
                    : 'Transferencia'}
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  <Button
                    variant="whatsapp"
                    fullWidth
                    icon={<MessageCircle className="h-4 w-4" />}
                    onClick={() =>
                      openWhatsApp(
                        buildOrderStatusMessage(order),
                        order.customerPhone,
                      )
                    }
                  >
                    Compartir por WhatsApp
                  </Button>

                  {next && (
                    <Button
                      variant="secondary"
                      fullWidth
                      icon={<ChevronRight className="h-4 w-4" />}
                      onClick={() => {
                        updateOrderStatus(order.id, next).catch(() =>
                          window.alert('No se pudo actualizar el pedido.'),
                        )
                      }}
                    >
                      Pasar a: {ORDER_STATUS_LABELS[next]}
                    </Button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-brand-200 bg-white/50 px-6 py-12 text-center">
      <p className="font-semibold text-brand-800">Sin pedidos en este filtro</p>
      <p className="mt-1 text-sm text-brand-600/65">
        Cambia el estado o crea un pedido nuevo.
      </p>
    </div>
  )
}
