import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedAdmin } from './components/ProtectedAdmin'
import { PublicLayout } from './layouts/PublicLayout'
import { PublicHomePage } from './pages/public/HomePage'
import { MenuPage } from './pages/public/MenuPage'
import { CheckoutPage } from './pages/public/CheckoutPage'

const AdminLayout = lazy(() =>
  import('./layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const AdminLoginPage = lazy(() =>
  import('./pages/admin/LoginPage').then((m) => ({ default: m.AdminLoginPage })),
)
const MenuAdminPage = lazy(() =>
  import('./pages/admin/MenuAdminPage').then((m) => ({
    default: m.MenuAdminPage,
  })),
)
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const NewOrderPage = lazy(() =>
  import('./pages/NewOrderPage').then((m) => ({ default: m.NewOrderPage })),
)
const OrdersPage = lazy(() =>
  import('./pages/OrdersPage').then((m) => ({ default: m.OrdersPage })),
)
const DeliveriesPage = lazy(() =>
  import('./pages/DeliveriesPage').then((m) => ({ default: m.DeliveriesPage })),
)
const CustomersPage = lazy(() =>
  import('./pages/CustomersPage').then((m) => ({ default: m.CustomersPage })),
)

function AdminFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted">
      Cargando…
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative min-h-0 flex-1">
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<PublicHomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="pedido" element={<CheckoutPage />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          </ProtectedAdmin>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="menu" element={<MenuAdminPage />} />
        <Route path="nuevo" element={<NewOrderPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="entregas" element={<DeliveriesPage />} />
        <Route path="clientes" element={<CustomersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      </div>
    </div>
  )
}
