import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, MapPin, MessageCircle, Minus, Plus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useApp } from '../../hooks/useApp'
import type { PaymentMethod } from '../../types'
import { Field, Input, TextArea } from '../../components/Field'
import { Button } from '../../components/Button'
import {
  buildCustomerOrderMessage,
  formatRD,
  mapsUrl,
  openWhatsApp,
} from '../../lib/whatsapp'
import { BUSINESS } from '../../config/business'

export function CheckoutPage() {
  const { lines, total, setQuantity, clearCart, openCart } = useCart()
  const { addOrder } = useApp()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo')
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const canSubmit =
    lines.length > 0 &&
    customerName.trim() &&
    customerPhone.trim() &&
    address.trim()

  async function handleSend() {
    if (!canSubmit) return

    setSendError('')
    setSending(true)
    try {
      const order = await addOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.replace(/\D/g, ''),
        address: address.trim(),
        items: lines.map(({ dish, quantity }) => ({ dishId: dish.id, quantity })),
        paymentMethod,
        notes: notes.trim(),
      })

      openWhatsApp(
        buildCustomerOrderMessage({
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          address: order.address,
          items: order.items,
          paymentMethod: order.paymentMethod,
          notes: order.notes,
          total: order.total,
        }),
        BUSINESS.whatsapp,
      )

      clearCart()
      setSent(true)
    } catch {
      setSendError('No se pudo enviar el pedido. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-brand-100 bg-white/85 px-6 py-14 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Check className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-800">
          Pedido listo para WhatsApp
        </h1>
        <p className="mt-2 text-sm text-brand-600/75">
          Se abrió el chat con {BUSINESS.name}. Envía el mensaje para confirmar.
          El dueño también lo verá en el panel.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link to="/menu">
            <Button variant="primary" fullWidth>
              Seguir mirando el menú
            </Button>
          </Link>
          <Button variant="ghost" fullWidth onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-brand-200 bg-white/50 px-6 py-14 text-center">
        <p className="font-semibold text-brand-800">Aún no hay platos</p>
        <p className="mt-1 text-sm text-brand-600/65">
          Elige del menú para armar tu pedido.
        </p>
        <Link to="/menu" className="mt-5 inline-block">
          <Button variant="primary">Ir al menú</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-xs font-medium tracking-wide text-brand-600/60 uppercase">
          Checkout
        </p>
        <h1 className="font-display text-2xl font-bold text-brand-800">
          Confirmar pedido
        </h1>
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-800">Tus platos</h2>
          <button
            type="button"
            onClick={openCart}
            className="text-xs font-semibold text-brand-600"
          >
            Editar
          </button>
        </div>
        {lines.map(({ dish, quantity }) => (
          <div
            key={dish.id}
            className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white/90 p-2.5"
          >
            <img
              src={dish.image}
              alt=""
              className="h-14 w-12 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{dish.name}</p>
              <p className="text-xs text-brand-600/65">
                {formatRD(dish.price * quantity)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50"
                onClick={() => setQuantity(dish.id, quantity - 1)}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-4 text-center text-sm font-bold">{quantity}</span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white"
                onClick={() => setQuantity(dish.id, quantity + 1)}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-brand-800">Tus datos</h2>
        <Field label="Nombre">
          <Input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Tu nombre"
          />
        </Field>
        <Field label="Teléfono">
          <Input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="849 000 0000"
          />
        </Field>
        <Field label="Dirección de entrega">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle, sector, referencias…"
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
        <h2 className="text-sm font-semibold text-brand-800">Método de pago</h2>
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
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold ${
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

      <Field label="Notas (opcional)">
        <TextArea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Sin ajonjolí, llamar al llegar…"
        />
      </Field>

      <div className="rounded-3xl border border-brand-100 bg-white/95 p-4 shadow-lg shadow-brand-900/5">
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-brand-600/70">Total · {BUSINESS.deliveryNote}</span>
          <span className="font-display text-xl font-bold text-brand-800">
            {formatRD(total)}
          </span>
        </div>
        {sendError && (
          <p className="mb-2 text-center text-xs font-medium text-red-600">{sendError}</p>
        )}
        <Button
          variant="whatsapp"
          fullWidth
          disabled={!canSubmit || sending}
          icon={<MessageCircle className="h-5 w-5" />}
          onClick={handleSend}
        >
          {sending ? 'Enviando…' : 'Enviar pedido por WhatsApp'}
        </Button>
      </div>
    </div>
  )
}
