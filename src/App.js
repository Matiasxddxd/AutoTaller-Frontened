import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { OrderDetailPage } from './pages/orders/OrderDetailPage';
import { ClientsPage } from './pages/clients/ClientsPage';
import { ClientDetailPage } from './pages/clients/ClientDetailPage';
import { VehiclesPage } from './pages/vehicles/VehiclesPage';
import { QuotesPage } from './pages/quotes/QuotesPage';
import { RepuestosPage } from './pages/repuestos/RepuestosPage';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000,
            retry: 1,
        },
    },
});
export default function App() {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/orders", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { roles: ['admin'], children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/orders", element: _jsx(OrdersPage, {}) }), _jsx(Route, { path: "/orders/:id", element: _jsx(OrderDetailPage, {}) }), _jsx(Route, { path: "/clients", element: _jsx(ClientsPage, {}) }), _jsx(Route, { path: "/clients/:id", element: _jsx(ClientDetailPage, {}) }), _jsx(Route, { path: "/vehicles", element: _jsx(VehiclesPage, {}) }), _jsx(Route, { path: "/quotes", element: _jsx(QuotesPage, {}) }), _jsx(Route, { path: "/repuestos", element: _jsx(ProtectedRoute, { roles: ['admin'], children: _jsx(RepuestosPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/orders", replace: true }) })] })] }) }), _jsx(Toaster, { position: "bottom-right", toastOptions: {
                    style: {
                        background: '#1c2333',
                        color: '#e2e8f0',
                        border: '1px solid #1e2a3a',
                        borderRadius: '12px',
                        fontSize: '13px',
                    },
                    success: { iconTheme: { primary: '#10b981', secondary: '#1c2333' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#1c2333' } },
                } })] }));
}
