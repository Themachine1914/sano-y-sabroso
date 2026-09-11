import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isAdminRequest } from '../_lib/auth.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.status(200).json({ isAuthenticated: isAdminRequest(req) })
}
