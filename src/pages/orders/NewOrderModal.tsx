import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal, Spinner } from '../../components/ui'
import { ordenesApi, vehiculosApi, clientesApi } from '../../api'
import type { OrdenTrabajo } from '../../types'

interface Props { open: boolean; onClose: () => void }

export const NewOrderModal = ({ open, onClose }: Props) => {
  const [clienteSearch, setClienteSearch] = useState('')
  const [selectedClienteId, setSelectedClienteId] = useState('')
  const qc = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<OrdenTrabajo>>()

  const { data: clientes = [] } = useQuery({
    queryKey: ['clients-search', clienteSearch],
    queryFn:  () => clientesApi.list({ search: clienteSearch, limit: 8 }).then(r => r.data),
    enabled:  clienteSearch.length > 1,
  })

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehicles-by-client', selectedClienteId],
    queryFn:  () => vehiculosApi.list({ cliente_id: selectedClienteId }),
    enabled:  !!selectedClienteId,
  })

  const mutation = useMutation({
    mutationFn: (data: Partial<OrdenTrabajo>) => ordenesApi.create(data),
    onSuccess: () => {
      toast.success('Orden creada correctamente')
      qc.invalidateQueries({ queryKey: ['orders'] })
      reset(); setClienteSearch(''); setSelectedClienteId('')
      onClose()
    },
  })

  return (
    <Modal open={open} onClose={onClose} title="Nueva orden de trabajo" size="lg">
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Buscar cliente */}
          <div className="col-span-2">
            <label className="label">Buscar cliente</label>
            <input
              className="input"
              placeholder="Nombre, RUT o email..."
              value={clienteSearch}
              onChange={e => setClienteSearch(e.target.value)}
            />
            {clientes.length > 0 && !selectedClienteId && (
              <div className="mt-1 bg-surface-3 border border-line rounded-xl overflow-hidden">
                {clientes.map(c => (
                  <button
                    key={c.id} type="button"
                    onClick={() => { setSelectedClienteId(c.id); setClienteSearch(c.nombre) }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-surface-4 transition-colors"
                  >
                    <span className="text-ink">{c.nombre}</span>
                    <span className="text-ink-faint ml-2 text-xs">{c.telefono}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehículo */}
          <div className="col-span-2">
            <label className="label">Vehículo</label>
            <select className="input" disabled={!selectedClienteId} {...register('vehiculo_id', { required: true })}>
              <option value="">Seleccionar vehículo...</option>
              {vehiculos.map(v => (
                <option key={v.id} value={v.id}>
                  {v.patente} — {v.marca} {v.modelo} {v.anio}
                </option>
              ))}
            </select>
            {errors.vehiculo_id && <p className="text-xs text-accent-red mt-1">Vehículo requerido</p>}
          </div>

          {/* Prioridad */}
          <div>
            <label className="label">Prioridad</label>
            <select className="input" {...register('prioridad')}>
              <option value="normal">Normal</option>
              <option value="baja">Baja</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          {/* Kilometraje */}
          <div>
            <label className="label">Kilometraje ingreso</label>
            <input type="number" className="input" placeholder="85000" {...register('kilometraje_ingreso')} />
          </div>

          {/* Fecha estimada */}
          <div>
            <label className="label">Fecha estimada entrega</label>
            <input type="date" className="input" {...register('fecha_estimada')} />
          </div>

          {/* Diagnóstico */}
          <div className="col-span-2">
            <label className="label">Diagnóstico inicial</label>
            <textarea rows={3} className="input resize-none" placeholder="Descripción del problema..." {...register('diagnostico')} />
          </div>

          {/* Notas internas */}
          <div className="col-span-2">
            <label className="label">Notas internas</label>
            <textarea rows={2} className="input resize-none" placeholder="Solo visible para el equipo..." {...register('notas_internas')} />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? <><Spinner size={14} /> Creando...</> : 'Crear orden'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
