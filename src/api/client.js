import axios from 'axios';
import toast from 'react-hot-toast';
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 15000,
});
// Adjuntar token JWT en cada request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});
// Manejar errores globalmente
api.interceptors.response.use((res) => res, (error) => {
    const msg = error.response?.data?.error || 'Error de conexión';
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
    }
    if (error.response?.status !== 404) {
        toast.error(msg);
    }
    return Promise.reject(error);
});
// ── Helpers tipados ───────────────────────────────────────────────────────────
export const apiGet = (url, params) => api.get(url, { params }).then(r => r.data);
export const apiPost = (url, data) => api.post(url, data).then(r => r.data);
export const apiPut = (url, data) => api.put(url, data).then(r => r.data);
export const apiPatch = (url, data) => api.patch(url, data).then(r => r.data);
export const apiDelete = (url) => api.delete(url).then(r => r.data);
