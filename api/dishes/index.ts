import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSupabase } from '../_lib/supabase.js'
import { isAdminRequest, requireAdmin } from '../_lib/auth.js'

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
  const supabase = getSupabase()

  if (req.method === 'GET') {
    let query = supabase.from('dishes').select('*').order('created_at', { ascending: true })
    if (!isAdminRequest(req)) {
      query = query.eq('available', true)
    }
    const { data, error } = await query
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json(data.map(toDish))
    return
  }

  if (req.method === 'POST') {
    if (requireAdmin(req, res)) return

    const { name, description, price, image } = req.body ?? {}
    if (!name || !description || typeof price !== 'number' || !image) {
      res.status(400).json({ error: 'Faltan campos requeridos' })
      return
    }

    const { data, error } = await supabase
      .from('dishes')
      .insert({ name, description, price, image_url: image, available: true })
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(201).json(toDish(data))
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
