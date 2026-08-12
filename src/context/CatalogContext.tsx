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
import { DISHES as SEED_DISHES } from '../data/mock'
import type { Dish } from '../types'

const STORAGE_KEY = 'sano-sabroso-catalog-v1'

export interface DishInput {
  name: string
  description: string
  price: number
  image: string
}

interface CatalogContextValue {
  dishes: Dish[]
  getDishById: (id: string) => Dish | undefined
  addDish: (input: DishInput) => Dish
  updateDish: (id: string, patch: Partial<Omit<Dish, 'id'>>) => void
  removeDish: (id: string) => void
  resetCatalog: () => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

function loadCatalog(): Dish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(SEED_DISHES)
    const parsed = JSON.parse(raw) as Dish[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return structuredClone(SEED_DISHES)
    }
    return parsed.map((dish) => ({
      id: dish.id,
      name: dish.name || 'Plato',
      description: dish.description || '',
      price: Number(dish.price) || 0,
      image: dish.image || '/dishes/plato-01.jpg',
    }))
  } catch {
    return structuredClone(SEED_DISHES)
  }
}

function createId(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug || 'plato'}-${Date.now().toString(36)}`
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>(() => loadCatalog())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes))
    } catch (error) {
      console.warn(
        'No se pudo guardar el menú. Las fotos pueden ser muy pesadas.',
        error,
      )
    }
  }, [dishes])

  const getDishById = useCallback(
    (id: string) => dishes.find((d) => d.id === id),
    [dishes],
  )

  const addDish = useCallback((input: DishInput) => {
    const dish: Dish = {
      id: createId(input.name),
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      image: input.image,
    }
    setDishes((prev) => [dish, ...prev])
    return dish
  }, [])

  const updateDish = useCallback(
    (id: string, patch: Partial<Omit<Dish, 'id'>>) => {
      setDishes((prev) =>
        prev.map((dish) => (dish.id === id ? { ...dish, ...patch } : dish)),
      )
    },
    [],
  )

  const removeDish = useCallback((id: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const resetCatalog = useCallback(() => {
    const fresh = structuredClone(SEED_DISHES)
    setDishes(fresh)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  }, [])

  const value = useMemo(
    () => ({
      dishes,
      getDishById,
      addDish,
      updateDish,
      removeDish,
      resetCatalog,
    }),
    [dishes, getDishById, addDish, updateDish, removeDish, resetCatalog],
  )

  return createElement(CatalogContext.Provider, { value }, children)
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
