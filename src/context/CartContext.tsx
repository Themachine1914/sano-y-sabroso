import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { Dish } from '../types'
import { useCatalog } from './CatalogContext'

export interface CartLine {
  dish: Dish
  quantity: number
}

interface CartState {
  items: Record<string, number>
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD'; dishId: string; quantity?: number }
  | { type: 'SET_QTY'; dishId: string; quantity: number }
  | { type: 'REMOVE'; dishId: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }

interface CartContextValue {
  lines: CartLine[]
  total: number
  itemCount: number
  isOpen: boolean
  getQty: (dishId: string) => number
  addItem: (dishId: string, quantity?: number) => void
  setQuantity: (dishId: string, quantity: number) => void
  removeItem: (dishId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const initialState: CartState = { items: {}, isOpen: false }

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const add = action.quantity ?? 1
      const current = state.items[action.dishId] ?? 0
      return {
        ...state,
        isOpen: true,
        items: { ...state.items, [action.dishId]: current + add },
      }
    }
    case 'SET_QTY': {
      if (action.quantity <= 0) {
        const { [action.dishId]: _, ...rest } = state.items
        return { ...state, items: rest }
      }
      return {
        ...state,
        items: { ...state.items, [action.dishId]: action.quantity },
      }
    }
    case 'REMOVE': {
      const { [action.dishId]: _, ...rest } = state.items
      return { ...state, items: rest }
    }
    case 'CLEAR':
      return { ...state, items: {}, isOpen: false }
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { dishes } = useCatalog()
  const [state, dispatch] = useReducer(reducer, initialState)

  const lines = useMemo<CartLine[]>(() => {
    return Object.entries(state.items)
      .map(([dishId, quantity]) => {
        const dish = dishes.find((d) => d.id === dishId)
        if (!dish) return null
        return { dish, quantity }
      })
      .filter((line): line is CartLine => line !== null)
  }, [state.items, dishes])

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.dish.price * line.quantity, 0),
    [lines],
  )

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  )

  const getQty = useCallback(
    (dishId: string) => state.items[dishId] ?? 0,
    [state.items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      total,
      itemCount,
      isOpen: state.isOpen,
      getQty,
      addItem: (dishId, quantity) => dispatch({ type: 'ADD', dishId, quantity }),
      setQuantity: (dishId, quantity) =>
        dispatch({ type: 'SET_QTY', dishId, quantity }),
      removeItem: (dishId) => dispatch({ type: 'REMOVE', dishId }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
      toggleCart: () => dispatch({ type: 'TOGGLE' }),
    }),
    [lines, total, itemCount, state.isOpen, getQty],
  )

  return createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
