import type { VercelRequest, VercelResponse } from '@vercel/node'
import { setAdminCookie } from '../_lib/auth.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const pin = typeof req.body?.pin === 'string' ? req.body.pin.trim() : ''
  const expected = process.env.ADMIN_PIN

  if (!expected) {
    res.status(500).json({ error: 'ADMIN_PIN no configurado' })
    return
  }

  if (!pin || pin !== expected) {
    res.status(401).json({ error: 'PIN incorrecto' })
    return
  }

  setAdminCookie(res)
  res.status(200).json({ ok: true })
}
