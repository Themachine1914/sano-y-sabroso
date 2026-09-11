import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MapPin, MessageCircle, Minus, Plus } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { useApp } from '../hooks/useApp'
import type { OrderItem, PaymentMethod } from '../types'
import { Field, Input, TextArea } from '../components/Field'
import { Button } from '../components/Button'
import {
  buildOrderCreatedMessage,
  formatRD,
  mapsUrl,
  openWhatsApp,
} from '../lib/whatsapp'

export function NewOrderPage() {
  const { availableDishes } = useCatalog()
  const { addOrder } = useApp()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo')
  const [notes, setNotes] = useState('')
  const [qty, setQty] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const selectedItems: OrderItem[] = useMemo(() => {
    return availableDishes.filter((d) => (qty[d.id] ?? 0) > 0).map((d) => ({
      dishId: d.id,
      name: d.name,
      price: d.price,
      quantity: qty[d.id],
    }))
  }, [qty, availableDishes])

  const total = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const canSubmit =
    customerName.trim() &&
    customerPhone.trim() &&
    address.trim() &&
    selectedItems.length > 0

  function bump(id: string, delta: number) {
    setQty((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta)
      if (next === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  async function handleCreate() {
    if (!canSubmit) return

    setSubmitError('')
    setSubmitting(true)
    try {
      const order = await addOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.replace(/\D/g, ''),
        address: address.trim(),
        items: selectedItems.map((i) => ({ dishId: i.dishId, quantity: i.quantity })),
        paymentMethod,
        notes: notes.trim(),
      })
      openWhatsApp(buildOrderCreatedMessage(order), order.customerPhone)
      navigate('/admin/pedidos')
    } catch {
      setSubmitError('No se pudo crear el pedido. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-brand-800">
          Datos del cliente
        </h2>
        <Field label="Nombre">
          <Input
            placeholder="Ej. María Rodríguez"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field label="Teléfono" hint="Se usará para enviar el WhatsApp al cliente">
          <Input
            type="tel"
            placeholder="849 405 9209"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            autoComplete="tel"
          />
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-brand-800">
          Dirección / Ubicación
        </h2>
        <Field label="Dirección de entrega">
          <Input
            placeholder="Calle, sector, referencias…"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Field>
        <Button
          variant="secondary"
          fullWidth
          disabled={!address.trim()}
          icon={<MapPin className="h-4 w-4" />}
          onClick={() =>
            window.open(mapsUrl(address.trim()), '_blank', 'noopener,noreferrer')
          }
        >
          Abrir en Google Maps
        </Button>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-brand-800">
            Selección de platos
          </h2>
          {selectedItems.length > 0 && (
            <span className="text-xs font-semibold text-brand-600">
              {selectedItems.reduce((s, i) => s + i.quantity, 0)} seleccionados
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {availableDishes.map((dish) => {
            const count = qty[dish.id] ?? 0
            const active = count > 0
            return (
              <div
                key={dish.id}
                className={`flex gap-3 overflow-hidden rounded-3xl border bg-white/90 transition ${
                  active
                    ? 'border-brand-500 ring-2 ring-brand-500/20'
                    : 'border-brand-100'
                }`}
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-28 w-24 shrink-0 object-cover"
                  loading="lazy"
                />
                <div className="flex min-w-0 flex-1 flex-col py-2.5 pr-3">
                  <p className="truncate text-sm font-semibold text-brand-900">
                    {dish.name}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-brand-600/65">
                    {dish.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span className="text-sm font-bold text-brand-700">
                      {formatRD(dish.price)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {active ? (
                        <>
                          <button
                            type="button"
                            aria-label="Quitar"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700"
                            onClick={() => bump(dish.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold">
                            {count}
                          </span>
                          <button
                            type="button"
                            aria-label="Agregar"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white"
                            onClick={() => bump(dish.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="flex h-8 items-center gap-1 rounded-full bg-brand-600 px-3 text-xs font-semibold text-white"
                          onClick={() => bump(dish.id, 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-brand-800">
          Método de pago
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'efectivo', label: 'Efectivo' },
              { id: 'transferencia', label: 'Transferencia' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPaymentMethod(opt.id)}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                paymentMethod === opt.id
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-brand-200 bg-white text-brand-700'
              }`}
            >
              {paymentMethod === opt.id && <Check className="h-4 w-4" />}
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Field label="Notas del pedido">
          <TextArea
            placeholder="Ej. Sin ajonjolí, llamar al llegar…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
      </section>

      <div className="fixed inset-x-0 bottom-[4.5rem] z-20 mx-auto max-w-lg px-4">
        <div className="rounded-3xl border border-brand-100 bg-white/95 p-3 shadow-xl shadow-brand-900/10 backdrop-blur">
          <div className="mb-2 flex items-center justify-between px-1 text-sm">
            <span className="text-brand-600/70">Total</span>
            <span className="font-display text-lg font-bold text-brand-800">
              {formatRD(total)}
            </span>
          </div>
          {submitError && (
            <p className="mb-2 text-center text-xs font-medium text-red-600">
              {submitError}
            </p>
          )}
          <Button
            variant="whatsapp"
            fullWidth
            disabled={!canSubmit || submitting}
            icon={<MessageCircle className="h-5 w-5" />}
            onClick={handleCreate}
          >
            {submitting ? 'Creando…' : 'Crear Pedido + Enviar por WhatsApp'}
          </Button>
        </div>
      </div>
    </div>
  )
}
