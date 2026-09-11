import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface AdminAuthValue {
  isAuthenticated: boolean
  isLoading: boolean
  login: (pin: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { isAuthenticated: false }))
      .then((data) => {
        if (!cancelled) setIsAuthenticated(Boolean(data.isAuthenticated))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (pin: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ pin }),
    })
    const ok = res.ok
    setIsAuthenticated(ok)
    return ok
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, login, logout }),
    [isAuthenticated, isLoading, login, logout],
  )

  return createElement(AdminAuthContext.Provider, { value }, children)
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
