export type OrderStatus =
  | 'pendiente'
  | 'en_preparacion'
  | 'listo_entrega'
  | 'entregado'

export type PaymentMethod = 'efectivo' | 'transferencia'

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  image: string
  available: boolean
}

export interface OrderItem {
  dishId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  address: string
  items: OrderItem[]
  paymentMethod: PaymentMethod
  notes: string
  status: OrderStatus
  createdAt: string
  total: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  lastAddress: string
  lastOrderAt: string
  orderCount: number
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  en_preparacion: 'En preparación',
  listo_entrega: 'Listo para entrega',
  entregado: 'Entregado',
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pendiente',
  'en_preparacion',
  'listo_entrega',
  'entregado',
]
