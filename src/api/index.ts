import { apiGet, apiPost, apiPut, apiPatch, apiDelete, api } from './client'
import type {
  AuthResponse, Cliente, Vehiculo, Cotizacion, CotizacionItem,
  OrdenTrabajo, Repuesto, DashboardData, PaginatedResponse, OrderStatus, QuoteStatus,
} from '../types'

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiPost<AuthResponse>('/auth/login', { email, password }),
  me: () => apiGet<{ id: string; email: string; role: string }>('/auth/me'),
}

// ── CLIENTES ──────────────────────────────────────────────────────────────────
export const clientesApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    apiGet<PaginatedResponse<Cliente>>('/clients', params),
  get: (id: string) => apiGet<Cliente>(`/clients/${id}`),
  create: (data: Partial<Cliente>) => apiPost<Cliente>('/clients', data),
  update: (id: string, data: Partial<Cliente>) => apiPut<Cliente>(`/clients/${id}`, data),
  delete: (id: string) => apiDelete(`/clients/${id}`),
}

// ── VEHÍCULOS ─────────────────────────────────────────────────────────────────
export const vehiculosApi = {
  list: (params?: { cliente_id?: string; search?: string }) =>
    apiGet<Vehiculo[]>('/vehicles', params),
  get: (id: string) => apiGet<Vehiculo>(`/vehicles/${id}`),
  create: (data: Partial<Vehiculo>) => apiPost<Vehiculo>('/vehicles', data),
  update: (id: string, data: Partial<Vehiculo>) => apiPut<Vehiculo>(`/vehicles/${id}`, data),
  delete: (id: string) => apiDelete(`/vehicles/${id}`),
}

// ── COTIZACIONES ──────────────────────────────────────────────────────────────
export const cotizacionesApi = {
  list: (params?: { estado?: QuoteStatus; cliente_id?: string }) =>
    apiGet<Cotizacion[]>('/quotes', params),
  get: (id: string) => apiGet<Cotizacion>(`/quotes/${id}`),
  create: (data: { cliente_id: string; vehiculo_id: string; items: CotizacionItem[]; notas?: string; vencimiento?: string }) =>
    apiPost<Cotizacion>('/quotes', data),
  updateStatus: (id: string, estado: QuoteStatus) =>
    apiPatch<Cotizacion>(`/quotes/${id}/status`, { estado }),
  downloadPdf: async (id: string, filename: string) => {
    const res = await api.get(`/quotes/${id}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const a   = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  },
}

// ── ÓRDENES ───────────────────────────────────────────────────────────────────
export const ordenesApi = {
  list: (params?: { estado?: OrderStatus; mecanico_id?: string }) =>
    apiGet<OrdenTrabajo[]>('/orders', params),
  get: (id: string) => apiGet<OrdenTrabajo>(`/orders/${id}`),
  create: (data: Partial<OrdenTrabajo>) => apiPost<OrdenTrabajo>('/orders', data),
  updateStatus: (id: string, estado: OrderStatus, comentario?: string) =>
    apiPatch<{ orderId: string; estadoNuevo: OrderStatus }>(`/orders/${id}/status`, { estado, comentario }),
  addService: (id: string, data: { descripcion: string; observaciones?: string; horas_trabajo?: number }) =>
    apiPost(`/orders/${id}/services`, data),
}

// ── REPUESTOS ─────────────────────────────────────────────────────────────────
export const repuestosApi = {
  list: (params?: { search?: string; stock_bajo?: boolean }) =>
    apiGet<Repuesto[]>('/repuestos', params),
  create: (data: Partial<Repuesto>) => apiPost<Repuesto>('/repuestos', data),
  update: (id: string, data: Partial<Repuesto>) => apiPut<Repuesto>(`/repuestos/${id}`, data),
  adjustStock: (id: string, cantidad: number, motivo?: string) =>
    apiPatch<Repuesto>(`/repuestos/${id}/stock`, { cantidad, motivo }),
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  dashboard: (mes?: number, anio?: number) =>
    apiGet<DashboardData>('/admin/dashboard', { mes, anio }),
}
