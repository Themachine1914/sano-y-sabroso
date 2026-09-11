import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSupabase } from '../_lib/supabase'
import { requireAdmin } from '../_lib/auth'

function toDish(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image: row.image_url,
    available: row.available,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (requireAdmin(req, res)) return

  const id = req.query.id
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'id inválido' })
    return
  }

  const supabase = getSupabase()

  if (req.method === 'PATCH') {
    const patch: Record<string, unknown> = {}
    const body = req.body ?? {}
    if (typeof body.name === 'string') patch.name = body.name
    if (typeof body.description === 'string') patch.description = body.description
    if (typeof body.price === 'number') patch.price = body.price
    if (typeof body.image === 'string') patch.image_url = body.image
    if (typeof body.available === 'boolean') patch.available = body.available
    patch.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('dishes')
      .update(patch)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json(toDish(data))
    return
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('dishes').delete().eq('id', id)
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(204).end()
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
