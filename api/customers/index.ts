import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSupabase } from '../_lib/supabase'
import { requireAdmin } from '../_lib/auth'

function toCustomer(row: any) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    lastAddress: row.last_address,
    lastOrderAt: row.last_order_at,
    orderCount: row.order_count,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  if (requireAdmin(req, res)) return

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('last_order_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.status(200).json(data.map(toCustomer))
}
