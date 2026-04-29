import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Car, ChevronRight, Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { vehiculosApi, clientesApi } from '../../api'
import { PageHeader, EmptyState, FullPageSpinner, Modal, Spinner, SearchInput } from '../../components/ui'
import type { Vehiculo } from '../../types'

const VehicleModal = ({
  open,
  onClose,
  vehiculo,
}: {
  open: boolean
  onClose: () => void
  vehiculo?: Vehiculo
}) => {
  const isEditing = !!vehiculo
  const [clienteSearch, setClienteSearch] = useState(vehiculo?.cliente_nombre ?? '')
  const [selectedId,    setSelectedId]    = useState(vehiculo?.cliente_id ?? '')
  const qc = useQueryClient()
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Partial<Vehiculo>>({
    defaultValues: vehiculo ?? {},
  })

  const { data: clientes = [] } = useQuery({
    queryKey: ['clients-search', clienteSearch],
    queryFn:  () => clientesApi.list({ search: clienteSearch, limit: 6 }).then(r => r.data),
    enabled:  clienteSearch.length > 1 && !selectedId,
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<Vehiculo>) => vehiculosApi.create(data),
    onSuccess: () => {
      toast.success('Vehículo registrado')
      qc.invalidateQueries({ queryKey: ['vehicles'] })
      reset(); setClienteSearch(''); setSelectedId(''); onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Vehiculo>) => vehiculosApi.update(vehiculo!.id, data),
    onSuccess: () => {
      toast.success('Vehículo actualizado')
      qc.invalidateQueries({ queryKey: ['vehicles'] })
      onClose()
    },
  })

  const mutation = isEditing ? updateMutation : createMutation
  const isPending = mutation.isPending

  const onSubmit = (data: Partial<Vehiculo>) => {
    if (!isEditing) data.cliente_id = selectedId
    mutation.mutate(data)
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar vehículo' : 'Registrar vehículo'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Cliente — solo en creación */}
          {!isEditing && (
            <div className="col-span-2">
              <label className="label">Cliente *</label>
              <input
                className="input" placeholder="Buscar cliente..."
                value={clienteSearch}
                onChange={e => { setClienteSearch(e.target.value); setSelectedId('') }}
              />
              {clientes.length > 0 && !selectedId && (
                <div className="mt-1 bg-surface-3 border border-line rounded-xl overflow-hidden">
                  {clientes.map(c => (
                    <button key={c.id} type="button"
                      onClick={() => { setSelectedId(c.id); setValue('cliente_id', c.id); setClienteSearch(c.nombre) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-surface-4 transition-colors"
                    >
                      <span className="text-ink">{c.nombre}</span>
                      <span className="text-ink-faint ml-2 text-xs">{c.rut}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="label">Patente *</label>
            <input className="input uppercase" placeholder="ABCD12"
              {...register('patente', { required: 'Requerido' })} />
            {errors.patente && <p className="text-xs text-accent-red mt-1">{errors.patente.message}</p>}
          </div>
          <div>
            <label className="label">VIN</label>
            <input className="input" placeholder="17 caracteres" maxLength={17} {...register('vin')} />
          </div>
          <div>
            <label className="label">Marca *</label>
            <input className="input" placeholder="Toyota" {...register('marca', { required: true })} />
          </div>
          <div>
            <label className="label">Modelo *</label>
            <input className="input" placeholder="Corolla" {...register('modelo', { required: true })} />
          </div>
          <div>
            <label className="label">Año</label>
            <input type="number" className="input" placeholder="2020" {...register('anio')} />
          </div>
          <div>
            <label className="label">Color</label>
            <input className="input" placeholder="Blanco" {...register('color')} />
          </div>
          <div>
            <label className="label">Combustible</label>
            <select className="input" {...register('combustible')}>
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diésel</option>
              <option value="electrico">Eléctrico</option>
              <option value="hibrido">Híbrido</option>
              <option value="gas">Gas</option>
            </select>
          </div>
          <div>
            <label className="label">Kilometraje</label>
            <input type="number" className="input" placeholder="85000" {...register('kilometraje')} />
          </div>
          <div className="col-span-2">
            <label className="label">Notas</label>
            <textarea rows={2} className="input resize-none" {...register('notas')} />
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={isPending || (!isEditing && !selectedId)} className="btn-primary">
            {isPending
              ? <><Spinner size={14} /> Guardando...</>
              : isEditing ? 'Guardar cambios' : 'Registrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export const VehiclesPage = () => {
  const [search,          setSearch]          = useState('')
  const [createModal,     setCreateModal]     = useState(false)
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | undefined>()
  const navigate = useNavigate()

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', search],
    queryFn:  () => vehiculosApi.list({ search }),
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vehículos"
        subtitle={`${vehicles.length} registrados`}
        action={
          <button onClick={() => setCreateModal(true)} className="btn-primary">
            <Plus size={15} /> Registrar vehículo
          </button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por patente, marca, modelo..." />

      {isLoading ? <FullPageSpinner /> : (
        <div className="card overflow-hidden">
          {vehicles.length === 0 ? (
            <EmptyState message="No se encontraron vehículos" icon={Car} />
          ) : (
            <table className="w-full">
              <thead className="bg-surface-2/50">
                <tr>
                  <th className="th text-left">Patente</th>
                  <th className="th text-left">Vehículo</th>
                  <th className="th text-left">Cliente</th>
                  <th className="th text-left">Color</th>
                  <th className="th text-right">Kilometraje</th>
                  <th className="th text-left">Combustible</th>
                  <th className="th" />
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id} className="table-row">
                    <td className="td font-mono font-semibold text-sm">{v.patente}</td>
                    <td className="td">
                      <p className="text-sm text-ink">{v.marca} {v.modelo}</p>
                      {v.anio && <p className="text-xs text-ink-faint">{v.anio}</p>}
                    </td>
                    <td className="td text-sm text-ink-muted">{v.cliente_nombre}</td>
                    <td className="td text-sm text-ink-muted">{v.color || '—'}</td>
                    <td className="td text-right text-sm text-ink-muted">
                      {v.kilometraje ? `${v.kilometraje.toLocaleString()} km` : '—'}
                    </td>
                    <td className="td text-sm text-ink-muted capitalize">{v.combustible}</td>
                    <td className="td">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={e => { e.stopPropagation(); setEditingVehiculo(v) }}
                          className="p-1.5 rounded-lg hover:bg-surface-3 text-ink-faint hover:text-ink transition-colors"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/vehicles/${v.id}`)}
                          className="p-1.5 rounded-lg hover:bg-surface-3 text-ink-faint transition-colors"
                        >
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <VehicleModal open={createModal} onClose={() => setCreateModal(false)} />
      <VehicleModal
        open={!!editingVehiculo}
        onClose={() => setEditingVehiculo(undefined)}
        vehiculo={editingVehiculo}
      />
    </div>
  )
}