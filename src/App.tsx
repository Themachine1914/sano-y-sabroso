import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedAdmin } from './components/ProtectedAdmin'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { PublicHomePage } from './pages/public/HomePage'
import { MenuPage } from './pages/public/MenuPage'
import { CheckoutPage } from './pages/public/CheckoutPage'
import { AdminLoginPage } from './pages/admin/LoginPage'
import { MenuAdminPage } from './pages/admin/MenuAdminPage'
import { DashboardPage } from './pages/DashboardPage'
import { NewOrderPage } from './pages/NewOrderPage'
import { OrdersPage } from './pages/OrdersPage'
import { DeliveriesPage } from './pages/DeliveriesPage'
import { CustomersPage } from './pages/CustomersPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<PublicHomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="pedido" element={<CheckoutPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <AdminLayout />
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
  )
}
