import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AppLayout }        from './components/layout/AppLayout'
import { ProtectedRoute }   from './components/layout/ProtectedRoute'
import { LoginPage }        from './pages/auth/LoginPage'
import { DashboardPage }    from './pages/dashboard/DashboardPage'
import { OrdersPage }       from './pages/orders/OrdersPage'
import { OrderDetailPage }  from './pages/orders/OrderDetailPage'
import { QuotesPage }       from './pages/quotes/QuotesPage'
import { ClientsPage }      from './pages/clients/ClientsPage'
import { ClientDetailPage } from './pages/clients/ClientDetailPage'
import { VehiclesPage }     from './pages/vehicles/VehiclesPage'
import { RepuestosPage }    from './pages/repuestos/RepuestosPage'
import { UsersPage }        from './pages/admin/UsersPage'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } })

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"    element={<DashboardPage />} />
              <Route path="orders"       element={<OrdersPage />} />
              <Route path="orders/:id"   element={<OrderDetailPage />} />
              <Route path="quotes"       element={<QuotesPage />} />
              <Route path="clients"      element={<ClientsPage />} />
              <Route path="clients/:id"  element={<ClientDetailPage />} />
              <Route path="vehicles"     element={<VehiclesPage />} />
              <Route path="vehicles/:id" element={<VehiclesPage />} />
              <Route path="repuestos"    element={<RepuestosPage />} />
              <Route path="users"        element={<UsersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e1e2e', color: '#cdd6f4', border: '1px solid #313244'}}}/>
    </QueryClientProvider>
  )
}