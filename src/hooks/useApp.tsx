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
import type { Customer, Order, OrderStatus, PaymentMethod } from '../types'

interface AppState {
  orders: Order[]
  customers: Customer[]
  loaded: boolean
}

export interface NewOrderInput {
  customerName: string
  customerPhone: string
  address: string
  items: { dishId: string; quantity: number }[]
  paymentMethod: PaymentMethod
  notes: string
}

interface AppContextValue extends AppState {
  addOrder: (input: NewOrderInput) => Promise<Order>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  readyForDelivery: Order[]
  todayOrders: Order[]
  pendingDeliveryCount: number
}

const AppContext = createContext<AppContextValue | null>(null)

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
  const [state, setState] = useState<AppState>({ orders: [], customers: [], loaded: false })

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [ordersRes, customersRes] = await Promise.all([
        fetch('/api/orders', { credentials: 'include' }),
        fetch('/api/customers', { credentials: 'include' }),
      ])
      const orders = ordersRes.ok ? ((await ordersRes.json()) as Order[]) : []
      const customers = customersRes.ok ? ((await customersRes.json()) as Customer[]) : []
      if (!cancelled) setState({ orders, customers, loaded: true })
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const addOrder = useCallback(async (input: NewOrderInput) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error('No se pudo crear el pedido')
    const order = (await res.json()) as Order

    setState((prev) => {
      const phone = order.customerPhone
      const existing = prev.customers.find((c) => c.phone === phone)
      const customers = existing
        ? prev.customers.map((c) =>
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
        : [
            {
              id: `pending-${order.id}`,
              name: order.customerName,
              phone,
              lastAddress: order.address,
              lastOrderAt: order.createdAt,
              orderCount: 1,
            },
            ...prev.customers,
          ]
      return { ...prev, orders: [order, ...prev.orders], customers }
    })

    return order
  }, [])

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include',
    })
    if (!res.ok) throw new Error('No se pudo actualizar el pedido')
    const updated = (await res.json()) as Order
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? updated : o)),
    }))
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
    }),
    [state, addOrder, updateOrderStatus, readyForDelivery, todayOrders, pendingDeliveryCount],
  )

  return createElement(AppContext.Provider, { value }, children)
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
