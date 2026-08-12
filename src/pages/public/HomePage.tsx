import { Link } from 'react-router-dom'
import { ArrowRight, Bike, Leaf, MessageCircle } from 'lucide-react'
import { BUSINESS } from '../../data/mock'
import { useCatalog } from '../../context/CatalogContext'
import { DishCard } from '../../components/DishCard'
import { Button } from '../../components/Button'
import { BrandMark } from '../../components/BrandMark'

export function PublicHomePage() {
  const { dishes } = useCatalog()
  const featured = dishes.slice(0, 4)

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-white/75 px-5 pt-8 pb-9 text-center shadow-[0_20px_50px_rgba(6,41,92,0.08)] ring-1 ring-white/80 backdrop-blur-sm">
        {/* blobs de color vivos */}
        <div
          className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-brand-400/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 right-1/4 h-28 w-28 -translate-y-1/2 rounded-full bg-sun-400/25 blur-2xl"
          aria-hidden
        />

        <div className="relative">
          <div className="fade-up float-soft mx-auto inline-block">
            <BrandMark size="hero" />
          </div>

          <p className="fade-up-delay mt-7 text-[11px] font-semibold tracking-[0.18em] text-brand-600 uppercase">
            Comida saludable · {BUSINESS.city}
          </p>

          <h1 className="fade-up-delay mt-3 text-[2.2rem] leading-[1.05] font-semibold tracking-tight text-navy-800 sm:text-[2.55rem]">
            Come sano.
            <br />
            <span className="text-accent-500">Pide fácil.</span>
          </h1>

          <p className="fade-up-delay-2 mx-auto mt-4 max-w-[30ch] text-[15px] leading-relaxed text-muted">
            Elige tu plato, arma el pedido y envíalo por WhatsApp. Delivery
            incluido.
          </p>

          <div className="fade-up-delay-2 mt-7">
            <Link to="/menu">
              <Button
                variant="accent"
                icon={<ArrowRight className="h-4 w-4" strokeWidth={1.75} />}
              >
                Ver menú
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        {[
          { icon: Leaf, label: 'Saludable', tone: 'bg-brand-100 text-brand-700' },
          { icon: Bike, label: 'Delivery', tone: 'bg-accent-500/10 text-accent-600' },
          {
            icon: MessageCircle,
            label: 'WhatsApp',
            tone: 'bg-navy-50 text-navy-800',
          },
        ].map(({ icon: Icon, label, tone }) => (
          <div
            key={label}
            className="rounded-2xl bg-white/80 px-2 py-4 text-center shadow-sm shadow-navy-800/5 ring-1 ring-white"
          >
            <span
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${tone}`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <p className="mt-2 text-[11px] font-semibold text-navy-800">{label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand-600 uppercase">
            Selección
          </p>
          <div className="mt-1.5 flex items-end justify-between gap-3">
            <h2 className="text-[1.55rem] leading-tight font-semibold tracking-tight text-navy-800">
              Platos del día
            </h2>
            <Link
              to="/menu"
              className="shrink-0 pb-0.5 text-xs font-semibold text-accent-500"
            >
              Ver todos
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {featured.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-navy-800 px-5 py-9 text-center text-white shadow-lg shadow-navy-800/25">
        <div
          className="pointer-events-none absolute -top-10 right-0 h-36 w-36 rounded-full bg-brand-400/30 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-accent-500/25 blur-2xl"
          aria-hidden
        />
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand-300 uppercase">
            Pedidos
          </p>
          <h2 className="mt-2 text-[1.55rem] font-semibold tracking-tight">
            ¿Listo para pedir?
          </h2>
          <p className="mx-auto mt-3 max-w-[28ch] text-sm leading-relaxed text-white/70">
            Efectivo o transferencia · {BUSINESS.deliveryNote}
          </p>
          <Link to="/menu" className="mt-6 inline-block">
            <Button variant="accent">Armar mi pedido</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
