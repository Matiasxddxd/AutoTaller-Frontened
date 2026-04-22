import { apiGet, apiPost, apiPut, apiPatch, apiDelete, api } from './client';
// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authApi = {
    login: (email, password) => apiPost('/auth/login', { email, password }),
    me: () => apiGet('/auth/me'),
};
// ── CLIENTES ──────────────────────────────────────────────────────────────────
export const clientesApi = {
    list: (params) => apiGet('/clients', params),
    get: (id) => apiGet(`/clients/${id}`),
    create: (data) => apiPost('/clients', data),
    update: (id, data) => apiPut(`/clients/${id}`, data),
    delete: (id) => apiDelete(`/clients/${id}`),
};
// ── VEHÍCULOS ─────────────────────────────────────────────────────────────────
export const vehiculosApi = {
    list: (params) => apiGet('/vehicles', params),
    get: (id) => apiGet(`/vehicles/${id}`),
    create: (data) => apiPost('/vehicles', data),
    update: (id, data) => apiPut(`/vehicles/${id}`, data),
    delete: (id) => apiDelete(`/vehicles/${id}`),
};
// ── COTIZACIONES ──────────────────────────────────────────────────────────────
export const cotizacionesApi = {
    list: (params) => apiGet('/quotes', params),
    get: (id) => apiGet(`/quotes/${id}`),
    create: (data) => apiPost('/quotes', data),
    updateStatus: (id, estado) => apiPatch(`/quotes/${id}/status`, { estado }),
    downloadPdf: async (id, filename) => {
        const res = await api.get(`/quotes/${id}/pdf`, { responseType: 'blob' });
        const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },
};
// ── ÓRDENES ───────────────────────────────────────────────────────────────────
export const ordenesApi = {
    list: (params) => apiGet('/orders', params),
    get: (id) => apiGet(`/orders/${id}`),
    create: (data) => apiPost('/orders', data),
    updateStatus: (id, estado, comentario) => apiPatch(`/orders/${id}/status`, { estado, comentario }),
    addService: (id, data) => apiPost(`/orders/${id}/services`, data),
};
// ── REPUESTOS ─────────────────────────────────────────────────────────────────
export const repuestosApi = {
    list: (params) => apiGet('/repuestos', params),
    create: (data) => apiPost('/repuestos', data),
    update: (id, data) => apiPut(`/repuestos/${id}`, data),
    adjustStock: (id, cantidad, motivo) => apiPatch(`/repuestos/${id}/stock`, { cantidad, motivo }),
};
// ── ADMIN ─────────────────────────────────────────────────────────────────────
export const adminApi = {
    dashboard: (mes, anio) => apiGet('/admin/dashboard', { mes, anio }),
};
