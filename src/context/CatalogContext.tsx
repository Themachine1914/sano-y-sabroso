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
import type { Dish } from '../types'

export interface DishInput {
  name: string
  description: string
  price: number
  image: string
}

interface CatalogContextValue {
  dishes: Dish[]
  availableDishes: Dish[]
  getDishById: (id: string) => Dish | undefined
  addDish: (input: DishInput) => Promise<Dish>
  updateDish: (id: string, patch: Partial<Omit<Dish, 'id'>>) => Promise<void>
  toggleDishAvailable: (id: string) => Promise<void>
  removeDish: (id: string) => Promise<void>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

async function parseOrThrow(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Error de servidor')
  }
  return res.status === 204 ? null : res.json()
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/dishes', { credentials: 'include' })
      .then((res) => (res.ok ? (res.json() as Promise<Dish[]>) : []))
      .then((data) => {
        if (!cancelled) setDishes(data)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const getDishById = useCallback(
    (id: string) => dishes.find((d) => d.id === id),
    [dishes],
  )

  const addDish = useCallback(async (input: DishInput) => {
    const dish = (await parseOrThrow(
      await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(input),
      }),
    )) as Dish
    setDishes((prev) => [dish, ...prev])
    return dish
  }, [])

  const updateDish = useCallback(async (id: string, patch: Partial<Omit<Dish, 'id'>>) => {
    const updated = (await parseOrThrow(
      await fetch(`/api/dishes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(patch),
      }),
    )) as Dish
    setDishes((prev) => prev.map((d) => (d.id === id ? updated : d)))
  }, [])

  const toggleDishAvailable = useCallback(
    async (id: string) => {
      const current = dishes.find((d) => d.id === id)
      if (!current) return
      await updateDish(id, { available: !(current.available !== false) })
    },
    [dishes, updateDish],
  )

  const removeDish = useCallback(async (id: string) => {
    await parseOrThrow(
      await fetch(`/api/dishes/${id}`, { method: 'DELETE', credentials: 'include' }),
    )
    setDishes((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const availableDishes = useMemo(
    () => dishes.filter((dish) => dish.available !== false),
    [dishes],
  )

  const value = useMemo(
    () => ({
      dishes,
      availableDishes,
      getDishById,
      addDish,
      updateDish,
      toggleDishAvailable,
      removeDish,
    }),
    [dishes, availableDishes, getDishById, addDish, updateDish, toggleDishAvailable, removeDish],
  )

  return createElement(CatalogContext.Provider, { value }, children)
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
