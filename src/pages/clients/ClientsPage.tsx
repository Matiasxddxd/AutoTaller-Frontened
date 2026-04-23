import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, Phone, Mail, Car, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { clientesApi } from '../../api'
import {
  PageHeader, EmptyState, FullPageSpinner, Modal, Spinner, SearchInput, ConfirmDialog,
} from '../../components/ui'
import { formatDate } from '../../lib/utils'
import type { Cliente } from '../../types'
import { useAuthStore } from '../../stores/authStore'

const ClientModal = ({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Cliente }) => {
  const qc = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Cliente>>({
    defaultValues: initial,
  })

  const mutation = useMutation({
    mutationFn: (data: Partial<Cliente>) =>
      initial ? clientesApi.update(initial.id, data) : clientesApi.create(data),
    onSuccess: () => {
      toast.success(initial ? 'Cliente actualizado' : 'Cliente creado')
      qc.invalidateQueries({ queryKey: ['clients'] })
      reset(); onClose()
    },
  })

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Editar cliente' : 'Nuevo cliente'} size="md">
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Nombre completo *</label>
            <input className="input" placeholder="Juan Pérez" {...register('nombre', { required: 'Requerido' })} />
            {errors.nombre && <p className="text-xs text-accent-red mt-1">{errors.nombre.message}</p>}
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input className="input" placeholder="+56912345678" {...register('telefono')} />
          </div>
          <div>
            <label className="label">RUT</label>
            <input className="input" placeholder="12.345.678-9" {...register('rut')} />
          </div>
          <div className="col-span-2">
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="juan@email.cl" {...register('email')} />
          </div>
          <div className="col-span-2">
            <label className="label">Instagram <span className="text-ink-faint normal-case font-normal">(opcional)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint text-sm">@</span>
              <input className="input pl-7" placeholder="usuario_instagram" {...register('instagram')} />
            </div>
          </div>
          <div className="col-span-2">
            <label className="label">Dirección</label>
            <input className="input" placeholder="Av. Principal 1234" {...register('direccion')} />
          </div>
          <div className="col-span-2">
            <label className="label">Notas</label>
            <textarea rows={2} className="input resize-none" {...register('notas')} />
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? <><Spinner size={14} /> Guardando...</> : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export const ClientsPage = () => {
  const [search,   setSearch]   = useState('')
  const [page,     setPage]     = useState(1)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState<Cliente | undefined>()
  const [deleting, setDeleting] = useState<Cliente | null>(null)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const user = useAuthStore(s => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['clients', search, page],
    queryFn: () => clientesApi.list({ search, page, limit: 20 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientesApi.delete(id),
    onSuccess: () => {
      toast.success('Cliente eliminado')
      qc.invalidateQueries({ queryKey: ['clients'] })
      setDeleting(null)
    },
  })

  const clients = data?.data ?? []
  const total   = data?.total ?? 0

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clientes"
        subtitle={`${total} registrados`}
        action={
          <button onClick={() => { setEditing(undefined); setModal(true) }} className="btn-primary">
            <Plus size={15} /> Nuevo cliente
          </button>
        }
      />

      <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Buscar por nombre, RUT, email..." />

      {isLoading ? <FullPageSpinner /> : (
        <div className="card overflow-hidden">
          {clients.length === 0 ? (
            <EmptyState message="No se encontraron clientes" icon={Users} />
          ) : (
            <table className="w-full">
              <thead className="bg-surface-2/50">
                <tr>
                  <th className="th text-left">Cliente</th>
                  <th className="th text-left">Contacto</th>
                  <th className="th text-left">Instagram</th>
                  <th className="th text-left">RUT</th>
                  <th className="th text-center">Vehículos</th>
                  <th className="th text-center">Órdenes</th>
                  <th className="th text-left">Desde</th>
                  <th className="th" />
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id} className="table-row cursor-pointer" onClick={() => navigate(`/clients/${c.id}`)}>
                    <td className="td">
                      <p className="font-medium text-ink">{c.nombre}</p>
                      {c.direccion && <p className="text-xs text-ink-faint">{c.direccion}</p>}
                    </td>
                    <td className="td">
                      {c.telefono && (
                        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                          <Phone size={11} />{c.telefono}
                        </div>
                      )}
                      {c.email && (
                        <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-0.5">
                          <Mail size={11} />{c.email}
                        </div>
                      )}
                    </td>
                    <td className="td text-xs text-ink-muted">
                      {(c as any).instagram ? `@${(c as any).instagram}` : '—'}
                    </td>
                    <td className="td font-mono text-xs text-ink-muted">{c.rut || '—'}</td>
                    <td className="td text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                        <Car size={12} />{c.total_vehiculos ?? 0}
                      </span>
                    </td>
                    <td className="td text-center text-xs text-ink-muted">{c.total_ordenes ?? 0}</td>
                    <td className="td text-xs text-ink-faint">{formatDate(c.created_at)}</td>
                    <td className="td">
                      <div className="flex gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); setEditing(c); setModal(true) }}
                          className="btn-ghost py-1 px-2 text-xs"
                        >
                          Editar
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={e => { e.stopPropagation(); setDeleting(c) }}
                            className="btn-ghost py-1 px-2 text-xs text-accent-red hover:bg-accent-red/10"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost">Anterior</button>
          <span className="text-sm text-ink-muted flex items-center">Página {page} de {Math.ceil(total / 20)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="btn-ghost">Siguiente</button>
        </div>
      )}

      <ClientModal open={modal} onClose={() => setModal(false)} initial={editing} />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Eliminar cliente"
        message={`¿Estás seguro que deseas eliminar a "${deleting?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}