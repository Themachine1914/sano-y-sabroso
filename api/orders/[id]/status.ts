import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSupabase } from '../../_lib/supabase'
import { requireAdmin } from '../../_lib/auth'

const VALID_STATUSES = ['pendiente', 'en_preparacion', 'listo_entrega', 'entregado']

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  if (requireAdmin(req, res)) return

  const rawId = req.query.id
  const numericId = Number(String(rawId).replace(/^ORD-/, ''))
  if (!Number.isInteger(numericId)) {
    res.status(400).json({ error: 'id inválido' })
    return
  }

  const status = req.body?.status
  if (!VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: 'status inválido' })
    return
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', numericId)
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.status(200).json(toOrder(data))
}
