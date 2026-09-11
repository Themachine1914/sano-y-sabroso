import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSupabase } from '../_lib/supabase'
import { requireAdmin } from '../_lib/auth'

interface LegacyDish {
  id: string
  name: string
  description: string
  price: number
  image: string
  available?: boolean
}

interface LegacyOrderItem {
  dishId: string
  name: string
  price: number
  quantity: number
}

interface LegacyOrder {
  customerName: string
  customerPhone: string
  address: string
  items: LegacyOrderItem[]
  paymentMethod: string
  notes: string
  status: string
  createdAt: string
  total: number
}

interface LegacyCustomer {
  name: string
  phone: string
  lastAddress: string
  lastOrderAt: string
  orderCount: number
}

/**
 * Migración única de los datos que quedaron en localStorage del navegador
 * del dueño (versión anterior de la app, antes de tener base de datos).
 * Reemplaza por completo dishes/orders/customers: lo que trae el navegador
 * se asume como el estado real más reciente. Requiere sesión de admin —
 * nunca se ejecuta automáticamente ni sin confirmación explícita del dueño.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  if (requireAdmin(req, res)) return

  const body = req.body ?? {}
  const dishes: LegacyDish[] = Array.isArray(body.dishes) ? body.dishes : []
  const orders: LegacyOrder[] = Array.isArray(body.orders) ? body.orders : []
  const customers: LegacyCustomer[] = Array.isArray(body.customers) ? body.customers : []

  const supabase = getSupabase()

  if (dishes.length > 0) {
    const { error: delErr } = await supabase.from('dishes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (delErr) {
      res.status(500).json({ error: `dishes: ${delErr.message}` })
      return
    }
    const { error: insErr } = await supabase.from('dishes').insert(
      dishes.map((d) => ({
        name: d.name,
        description: d.description,
        price: d.price,
        image_url: d.image,
        available: d.available !== false,
      })),
    )
    if (insErr) {
      res.status(500).json({ error: `dishes: ${insErr.message}` })
      return
    }
  }

  if (customers.length > 0) {
    const { error: delErr } = await supabase
      .from('customers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    if (delErr) {
      res.status(500).json({ error: `customers: ${delErr.message}` })
      return
    }
    const { error: insErr } = await supabase.from('customers').insert(
      customers.map((c) => ({
        name: c.name,
        phone: c.phone.replace(/\D/g, ''),
        last_address: c.lastAddress,
        last_order_at: c.lastOrderAt,
        order_count: c.orderCount,
      })),
    )
    if (insErr) {
      res.status(500).json({ error: `customers: ${insErr.message}` })
      return
    }
  }

  if (orders.length > 0) {
    const { error: delErr } = await supabase.from('orders').delete().gte('id', 0)
    if (delErr) {
      res.status(500).json({ error: `orders: ${delErr.message}` })
      return
    }
    const { error: insErr } = await supabase.from('orders').insert(
      orders.map((o) => ({
        customer_name: o.customerName,
        customer_phone: o.customerPhone.replace(/\D/g, ''),
        address: o.address,
        items: o.items,
        payment_method: o.paymentMethod,
        notes: o.notes,
        status: o.status,
        total: o.total,
        created_at: o.createdAt,
      })),
    )
    if (insErr) {
      res.status(500).json({ error: `orders: ${insErr.message}` })
      return
    }
  }

  res.status(200).json({
    ok: true,
    migrated: { dishes: dishes.length, orders: orders.length, customers: customers.length },
  })
}
