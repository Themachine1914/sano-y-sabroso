import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'

export function ProtectedAdmin({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted">
        Cargando…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}
