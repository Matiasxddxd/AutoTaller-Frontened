import axios from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

// Adjuntar token JWT en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Manejar errores globalmente
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error.response?.data?.error || 'Error de conexión'

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (error.response?.status !== 404) {
      toast.error(msg)
    }

    return Promise.reject(error)
  }
)

// ── Helpers tipados ───────────────────────────────────────────────────────────
export const apiGet    = <T>(url: string, params?: object) =>
  api.get<T>(url, { params }).then(r => r.data)

export const apiPost   = <T>(url: string, data?: object) =>
  api.post<T>(url, data).then(r => r.data)

export const apiPut    = <T>(url: string, data?: object) =>
  api.put<T>(url, data).then(r => r.data)

export const apiPatch  = <T>(url: string, data?: object) =>
  api.patch<T>(url, data).then(r => r.data)

export const apiDelete = (url: string) =>
  api.delete(url).then(r => r.data)
