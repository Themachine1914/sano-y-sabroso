import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BUSINESS } from '../../config/business'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { BrandMark } from '../../components/BrandMark'
import { Button } from '../../components/Button'
import { Field, Input } from '../../components/Field'

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ||
    '/admin'

  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (login(pin)) {
      navigate(from, { replace: true })
      return
    }
    setError('PIN incorrecto')
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] bg-white/80 px-5 py-8 shadow-[0_20px_50px_rgba(6,41,92,0.08)] ring-1 ring-white backdrop-blur-sm"
      >
        <div className="flex flex-col items-center text-center">
          <BrandMark size="lg" />
          <p className="mt-6 text-[11px] font-semibold tracking-[0.18em] text-brand-600 uppercase">
            Acceso
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-navy-800">
            Panel del dueño
          </h1>
          <p className="mt-2 max-w-[28ch] text-sm text-muted">
            Pedidos, entregas y clientes de {BUSINESS.name}.
          </p>
        </div>

        <div className="mt-8">
          <Field label="PIN de acceso" hint={`Demo: ${BUSINESS.adminPin}`}>
            <Input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              autoFocus
            />
          </Field>
          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}
        </div>

        <Button type="submit" variant="primary" fullWidth className="mt-5">
          Entrar
        </Button>

        <Link
          to="/"
          className="mt-6 block text-center text-sm font-medium text-muted"
        >
          ← Volver al menú
        </Link>
      </form>
    </div>
  )
}
