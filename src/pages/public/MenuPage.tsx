import { useCatalog } from '../../context/CatalogContext'
import { DishCard } from '../../components/DishCard'
import { useCart } from '../../context/CartContext'

export function MenuPage() {
  const { availableDishes } = useCatalog()
  const { itemCount } = useCart()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
          Catálogo
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy-800">
          Nuestro menú
        </h1>
        <p className="mt-1 text-sm text-muted">
          {availableDishes.length} platos
          {itemCount > 0 ? ` · ${itemCount} en tu pedido` : ''}
        </p>
      </div>

      {availableDishes.length === 0 ? (
        <p className="rounded-[1.5rem] bg-white/85 px-4 py-8 text-center text-sm text-muted shadow-sm ring-1 ring-white">
          No hay platos disponibles por ahora.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {availableDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  )
}
