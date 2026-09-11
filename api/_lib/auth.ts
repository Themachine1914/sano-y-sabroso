import { createHmac, timingSafeEqual } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const COOKIE_NAME = 'ss_admin'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 horas

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('Falta SESSION_SECRET')
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function createSessionCookieValue(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })).toString(
    'base64url',
  )
  return `${payload}.${sign(payload)}`
}

function isValidSessionValue(value: string | undefined): boolean {
  if (!value) return false
  const [payload, signature] = value.split('.')
  if (!payload || !signature) return false
  if (!safeEqual(sign(payload), signature)) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key) out[key] = decodeURIComponent(value)
  }
  return out
}

export function isAdminRequest(req: VercelRequest): boolean {
  const cookies = parseCookies(req.headers.cookie)
  return isValidSessionValue(cookies[COOKIE_NAME])
}

/** Corta la respuesta con 401 si no hay sesión admin válida. Devuelve true si cortó. */
export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: 'No autorizado' })
    return true
  }
  return false
}

export function setAdminCookie(res: VercelResponse): void {
  const value = createSessionCookieValue()
  const maxAge = Math.floor(SESSION_TTL_MS / 1000)
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`,
  )
}

export function clearAdminCookie(res: VercelResponse): void {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`)
}
