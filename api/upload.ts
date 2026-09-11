import { randomUUID } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSupabase } from './_lib/supabase'
import { requireAdmin } from './_lib/auth'

const BUCKET = 'dish-images'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  if (requireAdmin(req, res)) return

  const contentType = req.headers['content-type'] ?? 'image/jpeg'
  if (!contentType.startsWith('image/')) {
    res.status(400).json({ error: 'Solo se aceptan imágenes' })
    return
  }

  const body: Buffer = Buffer.isBuffer(req.body)
    ? req.body
    : await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => resolve(Buffer.concat(chunks)))
        req.on('error', reject)
      })

  if (body.length === 0) {
    res.status(400).json({ error: 'Body inválido (se esperaba binario)' })
    return
  }

  const ext = contentType.split('/')[1]?.split('+')[0] || 'jpg'
  const path = `${randomUUID()}.${ext}`

  const supabase = getSupabase()
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
    contentType,
    upsert: false,
  })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  res.status(201).json({ url: data.publicUrl })
}
