import type { OrderStatus } from '../types'
import { ORDER_STATUS_LABELS } from '../types'

const styles: Record<OrderStatus, string> = {
  pendiente: 'bg-sun-400/20 text-accent-700',
  en_preparacion: 'bg-navy-50 text-navy-700',
  listo_entrega: 'bg-accent-500/10 text-accent-600',
  entregado: 'bg-brand-100 text-brand-700',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}
