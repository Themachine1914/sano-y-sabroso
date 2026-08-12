import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Bike,
  ClipboardList,
  Instagram,
  PlusCircle,
  RefreshCw,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { BUSINESS } from '../data/mock'
import { formatRD, formatTime } from '../lib/whatsapp'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/Button'

export function DashboardPage() {
  const {
    todayOrders,
    pendingDeliveryCount,
    readyForDelivery,
    orders,
    resetDemo,
  } = useApp()

  const deliveredToday = todayOrders.filter((o) => o.status === 'entregado').length
  const revenueToday = todayOrders.reduce((sum, o) => sum + o.total, 0)
  const recent = orders.slice(0, 4)

  return (
    <div className="space-y-8">
      <section>
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
          Hoy en Santiago
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy-800">
          Resumen del día
        </h1>
        <p className="mt-1 text-sm text-muted">
          {BUSINESS.deliveryNote} · Efectivo o transferencia
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="Pedidos" value={String(todayOrders.length)} />
          <Stat label="Pendientes" value={String(pendingDeliveryCount)} highlight />
          <Stat label="Listos" value={String(readyForDelivery.length)} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-warm p-4">
          <p className="text-xs text-muted">Entregados hoy</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-navy-800">
            {deliveredToday}
          </p>
        </div>
        <div className="rounded-2xl bg-warm p-4">
          <p className="text-xs text-muted">Total del día</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-navy-800">
            {formatRD(revenueToday)}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy-800">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickLink
            to="/admin/menu"
            icon={<UtensilsCrossed className="h-5 w-5" strokeWidth={1.75} />}
            title="Menú y precios"
            subtitle="Fotos y precios"
            tone="accent"
          />
          <QuickLink
            to="/admin/nuevo"
            icon={<PlusCircle className="h-5 w-5" strokeWidth={1.75} />}
            title="Nuevo pedido"
            subtitle="Crear + WhatsApp"
            tone="brand"
          />
          <QuickLink
            to="/admin/entregas"
            icon={<Bike className="h-5 w-5" strokeWidth={1.75} />}
            title="Entregas"
            subtitle={`${readyForDelivery.length} listos`}
            tone="brand"
          />
          <QuickLink
            to="/admin/pedidos"
            icon={<ClipboardList className="h-5 w-5" strokeWidth={1.75} />}
            title="Ver pedidos"
            subtitle="Filtrar por estado"
            tone="brand"
          />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy-800">Últimos pedidos</h2>
          <Link to="/admin/pedidos" className="text-xs font-semibold text-accent-500">
            Ver todos
          </Link>
        </div>
        <div className="space-y-2">
          {recent.map((order) => (
            <div
              key={order.id}
              className="flex items-start gap-3 rounded-2xl bg-warm p-3.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy-800">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-navy-800">
                    {order.customerName}
                  </p>
                  <span className="shrink-0 text-xs text-muted">
                    {formatTime(order.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {order.id} · {formatRD(order.total)}
                </p>
                <div className="mt-1.5">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-2 pb-2">
        <a
          href={BUSINESS.instagram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-warm px-3 py-1.5 text-xs font-medium text-navy-800"
        >
          <Instagram className="h-3.5 w-3.5" strokeWidth={1.75} />
          {BUSINESS.instagramHandle}
        </a>
        <Button
          variant="ghost"
          className="!min-h-0 !px-3 !py-1.5 text-xs"
          icon={<RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />}
          onClick={resetDemo}
        >
          Reiniciar demo
        </Button>
      </section>
    </div>
  )
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl px-3 py-3 ${
        highlight ? 'bg-accent-500 text-white' : 'bg-warm text-navy-800'
      }`}
    >
      <p className={`text-[10px] font-medium ${highlight ? 'text-white/80' : 'text-muted'}`}>
        {label}
      </p>
      <p className="text-xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}

function QuickLink({
  to,
  icon,
  title,
  subtitle,
  tone,
}: {
  to: string
  icon: ReactNode
  title: string
  subtitle: string
  tone: 'brand' | 'accent'
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl bg-warm p-4 transition active:scale-[0.98]"
    >
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${
          tone === 'accent'
            ? 'bg-accent-500 text-white'
            : 'bg-white text-navy-800'
        }`}
      >
        {icon}
      </div>
      <p className="text-sm font-semibold text-navy-800">{title}</p>
      <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
    </Link>
  )
}
