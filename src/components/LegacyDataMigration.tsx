import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

const CATALOG_KEY = 'sano-sabroso-catalog-v1'
const APP_KEY = 'sano-sabroso-demo-v1'

interface LegacyData {
  dishes: unknown[]
  orders: unknown[]
  customers: unknown[]
}

function readLegacyData(): LegacyData | null {
  try {
    const catalogRaw = localStorage.getItem(CATALOG_KEY)
    const appRaw = localStorage.getItem(APP_KEY)
    if (!catalogRaw && !appRaw) return null

    const dishes = catalogRaw ? JSON.parse(catalogRaw) : []
    const app = appRaw ? JSON.parse(appRaw) : { orders: [], customers: [] }

    if (!Array.isArray(dishes) || dishes.length === 0) {
      if (!Array.isArray(app.orders) || app.orders.length === 0) return null
    }

    return {
      dishes: Array.isArray(dishes) ? dishes : [],
      orders: Array.isArray(app.orders) ? app.orders : [],
      customers: Array.isArray(app.customers) ? app.customers : [],
    }
  } catch {
    return null
  }
}

function clearLegacyStorage() {
  localStorage.removeItem(CATALOG_KEY)
  localStorage.removeItem(APP_KEY)
}

/**
 * Muestra un aviso una sola vez si detecta datos de la versión anterior
 * (localStorage) que todavía no están en la base de datos real. Nunca migra
 * en silencio — siempre pide confirmación explícita del dueño.
 */
export function LegacyDataMigration() {
  const [legacy, setLegacy] = useState<LegacyData | null>(null)
  const [status, setStatus] = useState<'idle' | 'migrating' | 'error' | 'done'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    setLegacy(readLegacyData())
  }, [])

  if (!legacy || status === 'done') return null

  async function migrate() {
    setStatus('migrating')
    setError('')
    try {
      const res = await fetch('/api/admin/migrate-legacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(legacy),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Error de servidor')
      }
      clearLegacyStorage()
      setStatus('done')
      window.location.reload()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'No se pudo migrar')
    }
  }

  function discard() {
    if (
      window.confirm(
        'Esto borra los datos guardados en este navegador sin subirlos a la base de datos. ¿Seguro?',
      )
    ) {
      clearLegacyStorage()
      setStatus('done')
    }
  }

  return (
    <div className="mx-4 mt-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" strokeWidth={1.75} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-900">
            Encontramos datos guardados en este navegador
          </p>
          <p className="mt-1 text-xs text-amber-800">
            De una versión anterior de la app (antes de tener base de datos real):{' '}
            {legacy.dishes.length} platos, {legacy.orders.length} pedidos,{' '}
            {legacy.customers.length} clientes. ¿Quieres subirlos a la base de datos? Esto
            reemplazará lo que haya ahora.
          </p>
          {error && <p className="mt-1 text-xs font-medium text-red-700">{error}</p>}
          <div className="mt-3 flex gap-2">
            <Button
              variant="primary"
              className="!min-h-0 !px-3 !py-2 text-xs"
              disabled={status === 'migrating'}
              onClick={migrate}
            >
              {status === 'migrating' ? 'Migrando…' : 'Migrar ahora'}
            </Button>
            <Button
              variant="ghost"
              className="!min-h-0 !px-3 !py-2 text-xs"
              disabled={status === 'migrating'}
              onClick={discard}
            >
              Descartar (ya no los necesito)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
