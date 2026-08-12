import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './hooks/useApp'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { CatalogProvider } from './context/CatalogContext'
import { CartProvider } from './context/CartContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <CatalogProvider>
          <AppProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AppProvider>
        </CatalogProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
