import { MapPin, MessageCircle, Navigation } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { Button } from '../components/Button'
import {
  buildDriverRouteMessage,
  formatPhone,
  formatRD,
  mapsUrl,
  openWhatsApp,
} from '../lib/whatsapp'
import { BUSINESS } from '../data/mock'

export function DeliveriesPage() {
  const { readyForDelivery } = useApp()

  function shareRoute() {
    openWhatsApp(buildDriverRouteMessage(readyForDelivery))
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-warm p-5">
        <p className="text-[11px] font-medium tracking-[0.14em] text-accent-600 uppercase">
          Ruta del día
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy-800">
          {readyForDelivery.length === 0
            ? 'Nada listo aún'
            : `${readyForDelivery.length} entrega${
                readyForDelivery.length === 1 ? '' : 's'
              } lista${readyForDelivery.length === 1 ? '' : 's'}`}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Solo pedidos en estado «Listo para entrega». Comparte la ruta con el
          motorista por WhatsApp.
        </p>

        <Button
          variant="whatsapp"
          fullWidth
          className="mt-4 !py-4 text-base"
          disabled={readyForDelivery.length === 0}
          icon={<Navigation className="h-5 w-5" />}
          onClick={shareRoute}
        >
          Compartir ruta con el motorista
        </Button>
        <p className="mt-2 text-center text-[11px] text-brand-600/55">
          Se abre WhatsApp de {BUSINESS.name} con direcciones + Maps
        </p>
      </section>

      {readyForDelivery.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-brand-200 bg-white/50 px-6 py-10 text-center">
          <p className="font-semibold text-brand-800">
            No hay pedidos listos para entrega
          </p>
          <p className="mt-1 text-sm text-brand-600/65">
            En Pedidos, avanza el estado hasta «Listo para entrega».
          </p>
          <Link
            to="/admin/pedidos"
            className="mt-4 inline-block text-sm font-semibold text-brand-600"
          >
            Ir a pedidos →
          </Link>
        </div>
      ) : (
        <ol className="space-y-3">
          {readyForDelivery.map((order, index) => (
            <li
              key={order.id}
              className="rounded-3xl border border-brand-100 bg-white/85 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-brand-900">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-brand-600/65">
                    {formatPhone(order.customerPhone)} · {order.id}
                  </p>
                  <p className="mt-2 text-sm text-brand-800">{order.address}</p>
                  <p className="mt-1 text-xs text-brand-600/70">
                    {order.items
                      .map((i) => `${i.quantity}× ${i.name}`)
                      .join(' · ')}
                  </p>
                  <p className="mt-1 text-sm font-bold text-brand-700">
                    {formatRD(order.total)} ·{' '}
                    {order.paymentMethod === 'efectivo'
                      ? 'Efectivo'
                      : 'Transferencia'}
                  </p>
                  {order.notes ? (
                    <p className="mt-1 text-xs text-amber-700">📝 {order.notes}</p>
                  ) : null}

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 !py-2.5 text-xs"
                      icon={<MapPin className="h-3.5 w-3.5" />}
                      onClick={() =>
                        window.open(
                          mapsUrl(order.address),
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
                          `Hola ${order.customerName}, tu pedido ${order.id} de ${BUSINESS.name} va en camino 🛵📍`,
                          order.customerPhone,
                        )
                      }
                    >
                      Avisar
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
