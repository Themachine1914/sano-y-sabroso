import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clearAdminCookie } from '../_lib/auth.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  clearAdminCookie(res)
  res.status(200).json({ ok: true })
}
