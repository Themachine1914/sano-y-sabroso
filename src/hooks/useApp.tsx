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
import { INITIAL_CUSTOMERS, INITIAL_ORDERS } from '../data/mock'
import type { Customer, Order, OrderStatus } from '../types'

const STORAGE_KEY = 'sano-sabroso-demo-v1'

interface AppState {
  orders: Order[]
  customers: Customer[]
}

interface AppContextValue extends AppState {
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  readyForDelivery: Order[]
  todayOrders: Order[]
  pendingDeliveryCount: number
  resetDemo: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.orders?.length) return parsed
    }
  } catch {
    /* ignore */
  }
  return { orders: INITIAL_ORDERS, customers: INITIAL_CUSTOMERS }
}

function upsertCustomer(customers: Customer[], order: Order): Customer[] {
  const existing = customers.find(
    (c) => c.phone.replace(/\D/g, '') === order.customerPhone.replace(/\D/g, ''),
  )
  if (existing) {
    return customers.map((c) =>
      c.id === existing.id
        ? {
            ...c,
            name: order.customerName,
            lastAddress: order.address,
            lastOrderAt: order.createdAt,
            orderCount: c.orderCount + 1,
          }
        : c,
    )
  }
  return [
    {
      id: `c-${Date.now()}`,
      name: order.customerName,
      phone: order.customerPhone,
      lastAddress: order.address,
      lastOrderAt: order.createdAt,
      orderCount: 1,
    },
    ...customers,
  ]
}

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addOrder = useCallback((order: Order) => {
    setState((prev) => ({
      orders: [order, ...prev.orders],
      customers: upsertCustomer(prev.customers, order),
    }))
  }, [])

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }))
  }, [])

  const resetDemo = useCallback(() => {
    const fresh = { orders: INITIAL_ORDERS, customers: INITIAL_CUSTOMERS }
    setState(fresh)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  }, [])

  const todayOrders = useMemo(
    () => state.orders.filter((o) => isToday(o.createdAt)),
    [state.orders],
  )

  const readyForDelivery = useMemo(
    () => state.orders.filter((o) => o.status === 'listo_entrega'),
    [state.orders],
  )

  const pendingDeliveryCount = useMemo(
    () =>
      state.orders.filter(
        (o) =>
          o.status === 'pendiente' ||
          o.status === 'en_preparacion' ||
          o.status === 'listo_entrega',
      ).length,
    [state.orders],
  )

  const value = useMemo(
    () => ({
      ...state,
      addOrder,
      updateOrderStatus,
      readyForDelivery,
      todayOrders,
      pendingDeliveryCount,
      resetDemo,
    }),
    [
      state,
      addOrder,
      updateOrderStatus,
      readyForDelivery,
      todayOrders,
      pendingDeliveryCount,
      resetDemo,
    ],
  )

  return createElement(AppContext.Provider, { value }, children)
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
