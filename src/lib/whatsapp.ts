import { BUSINESS } from '../data/mock'
import type { Order, OrderItem, PaymentMethod } from '../types'

export function formatRD(amount: number): string {
  return `RD$ ${amount.toLocaleString('es-DO')}`
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-DO', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/** Normaliza a formato internacional DO (1 + 10 dígitos) para wa.me */
export function toWaPhone(phone?: string): string {
  const digits = (phone ?? BUSINESS.whatsapp).replace(/\D/g, '')
  if (digits.length === 10) return `1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return digits
  return BUSINESS.whatsapp
}

export function whatsappUrl(text: string, phone?: string): string {
  return `https://wa.me/${toWaPhone(phone)}?text=${encodeURIComponent(text)}`
}

function paymentLabel(method: PaymentMethod): string {
  return method === 'efectivo' ? 'Efectivo' : 'Transferencia'
}

function itemsLines(items: OrderItem[]): string {
  return items
    .map((i) => `• ${i.quantity}x ${i.name} — ${formatRD(i.price * i.quantity)}`)
    .join('\n')
}

/** Mensaje al crear pedido: confirmación lista para el cliente */
export function buildOrderCreatedMessage(order: Order): string {
  const notes = order.notes.trim()
    ? `\n📝 Notas: ${order.notes.trim()}`
    : ''

  return (
    `¡Hola ${order.customerName}! 👋\n` +
    `Tu pedido *${order.id}* en *${BUSINESS.name}* quedó registrado:\n\n` +
    `${itemsLines(order.items)}\n\n` +
    `📍 Entrega: ${order.address}\n` +
    `🗺️ ${mapsUrl(order.address)}\n` +
    `💳 Pago: ${paymentLabel(order.paymentMethod)}\n` +
    `💰 Total: *${formatRD(order.total)}*\n` +
    `🚚 ${BUSINESS.deliveryNote}` +
    notes +
    `\n\nTe avisamos cuando esté en camino. ¡Gracias! 🥗`
  )
}

/** Confirmación / actualización de estado al cliente */
export function buildOrderStatusMessage(order: Order): string {
  const statusText: Record<string, string> = {
    pendiente: 'recibimos tu pedido y pronto lo preparamos',
    en_preparacion: 'tu pedido está *en preparación* 👨‍🍳',
    listo_entrega: 'tu pedido está *listo* y saldrá a entrega 🛵',
    entregado: 'tu pedido fue *entregado*. ¡Buen provecho! 🙌',
  }

  return (
    `Hola ${order.customerName} 👋\n` +
    `Actualización de tu pedido *${order.id}* en *${BUSINESS.name}*:\n\n` +
    `${statusText[order.status]}\n\n` +
    `${itemsLines(order.items)}\n\n` +
    `📍 ${order.address}\n` +
    `💰 Total: *${formatRD(order.total)}* (${paymentLabel(order.paymentMethod)})\n\n` +
    `Cualquier duda, escríbenos por aquí.`
  )
}

/** Lista de entregas para el motorista */
export function buildDriverRouteMessage(orders: Order[]): string {
  if (orders.length === 0) {
    return `No hay pedidos listos para entrega ahora.`
  }

  const stops = orders
    .map((o, idx) => {
      const dishes = o.items
        .map((i) => `${i.quantity}x ${i.name}`)
        .join(', ')
      return (
        `*${idx + 1}. ${o.customerName}*\n` +
        `📞 ${formatPhone(o.customerPhone)}\n` +
        `📍 ${o.address}\n` +
        `🗺️ ${mapsUrl(o.address)}\n` +
        `🍽 ${dishes}\n` +
        `💳 ${paymentLabel(o.paymentMethod)} — ${formatRD(o.total)}` +
        (o.notes ? `\n📝 ${o.notes}` : '')
      )
    })
    .join('\n\n──────────\n\n')

  return (
    `🛵 *Ruta de entregas — ${BUSINESS.name}*\n` +
    `📅 ${new Date().toLocaleDateString('es-DO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })}\n` +
    `📦 ${orders.length} parada${orders.length === 1 ? '' : 's'}\n\n` +
    stops +
    `\n\n¡Buen viaje!`
  )
}

/** Mensaje del cliente desde el menú público → WhatsApp del negocio */
export function buildCustomerOrderMessage(options: {
  customerName: string
  customerPhone: string
  address: string
  items: OrderItem[]
  paymentMethod: PaymentMethod
  notes: string
  total: number
}): string {
  const notes = options.notes.trim()
    ? `\n📝 Notas: ${options.notes.trim()}`
    : ''

  return (
    `¡Hola! Quiero hacer un pedido en *${BUSINESS.name}* 🥗\n\n` +
    `👤 Nombre: ${options.customerName}\n` +
    `📞 Teléfono: ${formatPhone(options.customerPhone)}\n` +
    `📍 Entrega: ${options.address}\n` +
    `🗺️ ${mapsUrl(options.address)}\n\n` +
    `*Platos:*\n${itemsLines(options.items)}\n\n` +
    `💳 Pago: ${paymentLabel(options.paymentMethod)}\n` +
    `💰 Total: *${formatRD(options.total)}*\n` +
    `🚚 ${BUSINESS.deliveryNote}` +
    notes +
    `\n\n¡Gracias!`
  )
}

export function openWhatsApp(text: string, phone?: string): void {
  window.open(whatsappUrl(text, phone), '_blank', 'noopener,noreferrer')
}
