import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSupabase } from '../_lib/supabase'
import { requireAdmin } from '../_lib/auth'

function toOrder(row: any) {
  return {
    id: `ORD-${row.id}`,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    address: row.address,
    items: row.items,
    paymentMethod: row.payment_method,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    total: Number(row.total),
  }
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    if (requireAdmin(req, res)) return
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json(data.map(toOrder))
    return
  }

  if (req.method === 'POST') {
    const body = req.body ?? {}
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : ''
    const customerPhone = typeof body.customerPhone === 'string' ? body.customerPhone : ''
    const address = typeof body.address === 'string' ? body.address.trim() : ''
    const paymentMethod = body.paymentMethod === 'transferencia' ? 'transferencia' : 'efectivo'
    const notes = typeof body.notes === 'string' ? body.notes : ''
    const requestedItems: { dishId: string; quantity: number }[] = Array.isArray(body.items)
      ? body.items
      : []

    if (!customerName || !customerPhone || !address || requestedItems.length === 0) {
      res.status(400).json({ error: 'Faltan campos requeridos' })
      return
    }

    const dishIds = requestedItems.map((i) => i.dishId)
    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select('id, name, price')
      .in('id', dishIds)

    if (dishesError) {
      res.status(500).json({ error: dishesError.message })
      return
    }

    const dishById = new Map<string, { id: string; name: string; price: number }>(
      dishes.map((d) => [d.id, d]),
    )
    const items = requestedItems
      .filter((i) => dishById.has(i.dishId) && i.quantity > 0)
      .map((i) => {
        const dish = dishById.get(i.dishId)!
        return {
          dishId: dish.id,
          name: dish.name,
          price: Number(dish.price),
          quantity: i.quantity,
        }
      })

    if (items.length === 0) {
      res.status(400).json({ error: 'No hay platos válidos en el pedido' })
      return
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const phone = normalizePhone(customerPhone)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_phone: phone,
        address,
        items,
        payment_method: paymentMethod,
        notes,
        status: 'pendiente',
        total,
      })
      .select()
      .single()

    if (orderError) {
      res.status(500).json({ error: orderError.message })
      return
    }

    const nowIso = new Date().toISOString()
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, order_count')
      .eq('phone', phone)
      .maybeSingle()

    if (existingCustomer) {
      await supabase
        .from('customers')
        .update({
          name: customerName,
          last_address: address,
          last_order_at: nowIso,
          order_count: existingCustomer.order_count + 1,
        })
        .eq('id', existingCustomer.id)
    } else {
      await supabase.from('customers').insert({
        name: customerName,
        phone,
        last_address: address,
        last_order_at: nowIso,
        order_count: 1,
      })
    }

    res.status(201).json(toOrder(order))
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
