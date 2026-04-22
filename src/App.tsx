import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { AppLayout }       from './components/layout/AppLayout'
import { ProtectedRoute }  from './components/layout/ProtectedRoute'

import { LoginPage }        from './pages/auth/LoginPage'
import { DashboardPage }    from './pages/dashboard/DashboardPage'
import { OrdersPage }       from './pages/orders/OrdersPage'
import { OrderDetailPage }  from './pages/orders/OrderDetailPage'
import { ClientsPage }      from './pages/clients/ClientsPage'
import { ClientDetailPage } from './pages/clients/ClientDetailPage'
import { VehiclesPage }     from './pages/vehicles/VehiclesPage'
import { QuotesPage }       from './pages/quotes/QuotesPage'
import { RepuestosPage }    from './pages/repuestos/RepuestosPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* App — protegida */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirección raíz */}
            <Route index element={<Navigate to="/orders" replace />} />

            {/* Dashboard — solo admin */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['admin']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Órdenes */}
            <Route path="/orders"     element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />

            {/* Clientes */}
            <Route path="/clients"     element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />

            {/* Vehículos */}
            <Route path="/vehicles" element={<VehiclesPage />} />

            {/* Cotizaciones */}
            <Route path="/quotes" element={<QuotesPage />} />

            {/* Repuestos — solo admin */}
            <Route
              path="/repuestos"
              element={
                <ProtectedRoute roles={['admin']}>
                  <RepuestosPage />
                </ProtectedRoute>
              }
            />

            {/* 404 → redirigir */}
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1c2333',
            color: '#e2e8f0',
            border: '1px solid #1e2a3a',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#1c2333' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#1c2333' } },
        }}
      />
    </QueryClientProvider>
  )
}
