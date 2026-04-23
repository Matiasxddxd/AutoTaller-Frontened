import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Users, Trash2, Shield, Wrench } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { apiGet, apiPost, apiDelete } from '../../api/client'
import { PageHeader, EmptyState, FullPageSpinner, Modal, Spinner, ConfirmDialog } from '../../components/ui'
import { formatDate } from '../../lib/utils'

interface User {
  id: string
  email: string
  role: 'admin' | 'mecanico' | 'cliente'
  nombre?: string
  created_at: string
  activo: boolean
}

interface UserForm {
  email: string
  password: string
  role: 'admin' | 'mecanico'
  nombre?: string
  telefono?: string
  especialidad?: string
}

const UserModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const qc = useQueryClient()
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserForm>({
    defaultValues: { role: 'mecanico' }
  })
  const role = watch('role')

  const mutation = useMutation({
    mutationFn: (data: UserForm) => apiPost('/auth/register', data),
    onSuccess: () => {
      toast.success('Usuario creado')
      qc.invalidateQueries({ queryKey: ['users'] })
      reset(); onClose()
    },
  })

  return (
    <Modal open={open} onClose={onClose} title="Crear usuario" size="md">
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Rol *</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-xl border border-line bg-surface-2 hover:bg-surface-3 transition-colors">
                <input type="radio" value="mecanico" {...register('role')} />
                <Wrench size={14} className="text-brand" />
                <span className="text-sm">Mecánico</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-xl border border-line bg-surface-2 hover:bg-surface-3 transition-colors">
                <input type="radio" value="admin" {...register('role')} />
                <Shield size={14} className="text-accent-yellow" />
                <span className="text-sm">Admin</span>
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <label className="label">Nombre completo</label>
            <input className="input" placeholder="Juan Pérez" {...register('nombre')} />
          </div>

          <div className="col-span-2">
            <label className="label">Email *</label>
            <input type="email" className="input" placeholder="mecanico@taller.cl"
              {...register('email', { required: 'Email requerido' })} />
            {errors.email && <p className="text-xs text-accent-red mt-1">{errors.email.message}</p>}
          </div>

          <div className="col-span-2">
            <label className="label">Contraseña *</label>
            <input type="password" className="input" placeholder="Mínimo 8 caracteres"
              {...register('password', { required: 'Contraseña requerida', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} />
            {errors.password && <p className="text-xs text-accent-red mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="label">Teléfono</label>
            <input className="input" placeholder="+56912345678" {...register('telefono')} />
          </div>

          {role === 'mecanico' && (
            <div>
              <label className="label">Especialidad</label>
              <input className="input" placeholder="Ej: Motor, Frenos..." {...register('especialidad')} />
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? <><Spinner size={14} /> Creando...</> : 'Crear usuario'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export const UsersPage = () => {
  const [modal,    setModal]    = useState(false)
  const [deleting, setDeleting] = useState<User | null>(null)
  const qc = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiGet<User[]>('/admin/users'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success('Usuario eliminado')
      qc.invalidateQueries({ queryKey: ['users'] })
      setDeleting(null)
    },
  })

  const roleLabel = (role: string) => {
    if (role === 'admin') return { label: 'Admin', icon: <Shield size={12} className="text-accent-yellow" /> }
    if (role === 'mecanico') return { label: 'Mecánico', icon: <Wrench size={12} className="text-brand" /> }
    return { label: 'Cliente', icon: null }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Usuarios"
        subtitle={`${users.length} usuarios`}
        action={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Plus size={15} /> Crear usuario
          </button>
        }
      />

      {isLoading ? <FullPageSpinner /> : (
        <div className="card overflow-hidden">
          {users.length === 0 ? (
            <EmptyState message="No hay usuarios" icon={Users} />
          ) : (
            <table className="w-full">
              <thead className="bg-surface-2/50">
                <tr>
                  <th className="th text-left">Usuario</th>
                  <th className="th text-left">Rol</th>
                  <th className="th text-left">Creado</th>
                  <th className="th text-left">Estado</th>
                  <th className="th" />
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const { label, icon } = roleLabel(u.role)
                  return (
                    <tr key={u.id} className="table-row">
                      <td className="td">
                        <p className="font-medium text-ink">{u.nombre || u.email}</p>
                        {u.nombre && <p className="text-xs text-ink-faint">{u.email}</p>}
                      </td>
                      <td className="td">
                        <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                          {icon}{label}
                        </span>
                      </td>
                      <td className="td text-xs text-ink-faint">{formatDate(u.created_at)}</td>
                      <td className="td">
                        <span className={`text-xs font-medium ${u.activo ? 'text-accent-green' : 'text-accent-red'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="td">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => setDeleting(u)}
                            className="btn-ghost py-1 px-2 text-xs text-accent-red hover:bg-accent-red/10"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <UserModal open={modal} onClose={() => setModal(false)} />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Eliminar usuario"
        message={`¿Eliminar al usuario "${deleting?.email}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}