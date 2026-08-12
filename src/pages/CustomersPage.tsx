import { MessageCircle, MapPin, Phone } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { Button } from '../components/Button'
import {
  formatPhone,
  mapsUrl,
  openWhatsApp,
} from '../lib/whatsapp'

export function CustomersPage() {
  const { customers } = useApp()

  const sorted = [...customers].sort(
    (a, b) =>
      new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime(),
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-600/75">
        {sorted.length} clientes · última dirección usada en cada pedido
      </p>

      <div className="space-y-3">
        {sorted.map((customer) => (
          <article
            key={customer.id}
            className="rounded-3xl border border-brand-100 bg-white/85 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-brand-900">{customer.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-600/70">
                  <Phone className="h-3 w-3" />
                  {formatPhone(customer.phone)}
                </p>
              </div>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                {customer.orderCount} pedido
                {customer.orderCount === 1 ? '' : 's'}
              </span>
            </div>

            <p className="mt-3 flex items-start gap-1.5 text-sm text-brand-800">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
              {customer.lastAddress}
            </p>

            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 !py-2.5 text-xs"
                icon={<MapPin className="h-3.5 w-3.5" />}
                onClick={() =>
                  window.open(
                    mapsUrl(customer.lastAddress),
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              >
                Maps
              </Button>
              <Button
                variant="whatsapp"
                className="flex-1 !py-2.5 text-xs"
                icon={<MessageCircle className="h-3.5 w-3.5" />}
                onClick={() =>
                  openWhatsApp(
                    `Hola ${customer.name} 👋 ¿Deseas hacer un pedido de Sano & Sabroso hoy?`,
                    customer.phone,
                  )
                }
              >
                WhatsApp
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
