import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Wrench, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../../api'
import { useAuthStore } from '../../stores/authStore'
import { Spinner } from '../../components/ui'

interface LoginForm { email: string; password: string }

export const LoginPage = () => {
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()
  const setAuth  = useAuthStore(s => s.setAuth)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const res = await authApi.login(data.email, data.password)
      setAuth(res.user, res.token)
      toast.success(`Bienvenido, ${res.user.email}`)
      navigate(res.user.role === 'admin' ? '/dashboard' : '/orders')
    } catch {
      // el interceptor de axios ya muestra el toast de error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand rounded-2xl shadow-glow-blue mb-4">
            <Wrench size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-ink">AutoTaller</h1>
          <p className="text-sm text-ink-muted mt-1">Sistema de gestión de taller</p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Correo electrónico</label>
              <input
                type="email"
                placeholder="admin@autotaller.cl"
                className="input"
                {...register('email', { required: 'Email requerido' })}
              />
              {errors.email && (
                <p className="text-xs text-accent-red mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pr-10"
                  {...register('password', { required: 'Contraseña requerida' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-accent-red mt-1">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? <><Spinner size={15} /> Ingresando...</> : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-faint mt-4">
          AutoTaller © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
