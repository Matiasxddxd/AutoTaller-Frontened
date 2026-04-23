import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, FileText, Download, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { cotizacionesApi, clientesApi, vehiculosApi } from '../../api'
import {
  PageHeader, EmptyState, FullPageSpinner, Modal, Spinner,
  QuoteBadge, SearchInput, ConfirmDialog,
} from '../../components/ui'
import { formatDate, formatMoney } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'
import type { CotizacionItem, QuoteStatus } from '../../types'

const IVA = 0.19

interface QuoteForm {
  cliente_id: string
  vehiculo_id: string
  notas: string
  vencimiento: string
  incluye_iva: boolean
  items: CotizacionItem[]
}

const NewQuoteModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [clienteSearch, setClienteSearch] = useState('')
  const [selectedClienteId, setSelectedClienteId] = useState('')
  const qc = useQueryClient()

  const { register, handleSubmit, watch, setValue, control, reset } = useForm<QuoteForm>({
    defaultValues: {
      incluye_iva: true,
      items: [{ tipo: 'mano_de_obra', descripcion: '', cantidad: 1, precio_unitario: 0 }]
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const items = watch('items')
  const incluyeIva = watch('incluye_iva')

  const subtotal = items.reduce((s, i) => s + (Number(i.cantidad) * Number(i.precio_unitario)), 0)
  const iva = incluyeIva ? subtotal * IVA : 0
  const total = subtotal + iva

  const { data: clientes = [] } = useQuery({
    queryKey: ['clients-search', clienteSearch],
    queryFn: () => clientesApi.list({ search: clienteSearch, limit: 6 }).then(r => r.data),
    enabled: clienteSearch.length > 1,
  })
  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehicles-by-client', selectedClienteId],
    queryFn: () => vehiculosApi.list({ cliente_id: selectedClienteId }),
    enabled: !!selectedClienteId,
  })

  const mutation = useMutation({
    mutationFn: (data: QuoteForm) => cotizacionesApi.create({
      ...data,
      // Pasar IVA calculado al backend
      _iva_override: incluyeIva ? undefined : 0,
    } as any),
    onSuccess: () => {
      toast.success('Cotización creada')
      qc.invalidateQueries({ queryKey: ['quotes'] })
      reset(); setClienteSearch(''); setSelectedClienteId(''); onClose()
    },
  })

  return (
    <Modal open={open} onClose={onClose} title="Nueva cotización" size="xl">
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Cliente *</label>
            <input className="input" placeholder="Buscar cliente..."
              value={clienteSearch}
              onChange={e => { setClienteSearch(e.target.value); setSelectedClienteId('') }}
            />
            {clientes.length > 0 && !selectedClienteId && (
              <div className="mt-1 bg-surface-3 border border-line rounded-xl overflow-hidden">
                {clientes.map(c => (
                  <button key={c.id} type="button"
                    onClick={() => { setSelectedClienteId(c.id); setValue('cliente_id', c.id); setClienteSearch(c.nombre) }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-surface-4 transition-colors"
                  >
                    {c.nombre} <span className="text-ink-faint text-xs ml-2">{c.rut}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="label">Vehículo *</label>
            <select className="input" disabled={!selectedClienteId} {...register('vehiculo_id', { required: true })}>
              <option value="">Seleccionar...</option>
              {vehiculos.map(v => (
                <option key={v.id} value={v.id}>{v.patente} — {v.marca} {v.modelo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Válida hasta</label>
            <input type="date" className="input" {...register('vencimiento')} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Ítems</label>
            <button type="button"
              onClick={() => append({ tipo: 'repuesto', descripcion: '', cantidad: 1, precio_unitario: 0 })}
              className="btn-ghost text-xs"
            >
              <Plus size={12} /> Agregar ítem
            </button>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 px-2 text-xs text-ink-faint">
              <span className="col-span-1">Tipo</span>
              <span className="col-span-5">Descripción</span>
              <span className="col-span-2 text-right">Cant.</span>
              <span className="col-span-2 text-right">Precio unit.</span>
              <span className="col-span-1 text-right">Total</span>
              <span className="col-span-1" />
            </div>
            {fields.map((field, i) => {
              const rowTotal = Number(items[i]?.cantidad ?? 0) * Number(items[i]?.precio_unitario ?? 0)
              return (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-center bg-surface-2 rounded-xl px-2 py-2">
                  <div className="col-span-1">
                    <select className="input py-1.5 text-xs" {...register(`items.${i}.tipo`)}>
                      <option value="mano_de_obra">M.O.</option>
                      <option value="repuesto">Rep.</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="col-span-5">
                    <input className="input py-1.5 text-xs" placeholder="Descripción..." {...register(`items.${i}.descripcion`, { required: true })} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="0.01" step="0.01" className="input py-1.5 text-xs text-right" {...register(`items.${i}.cantidad`)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="0" step="1" className="input py-1.5 text-xs text-right" {...register(`items.${i}.precio_unitario`)} />
                  </div>
                  <div className="col-span-1 text-right text-xs font-medium text-ink">{formatMoney(rowTotal)}</div>
                  <div className="col-span-1 flex justify-end">
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(i)} className="text-ink-faint hover:text-accent-red p-1">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Toggle IVA + Totales */}
          <div className="flex justify-end mt-3 gap-4 items-end">
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-muted">Incluir IVA (19%)</label>
              <input type="checkbox" {...register('incluye_iva')} className="w-4 h-4 accent-brand" />
            </div>
            <div className="bg-surface-2 rounded-xl p-4 min-w-48 space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-muted"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
              {incluyeIva && (
                <div className="flex justify-between text-ink-muted"><span>IVA (19%)</span><span>{formatMoney(iva)}</span></div>
              )}
              <div className="flex justify-between font-semibold text-ink border-t border-line pt-1.5 mt-1">
                <span>Total</span><span className="text-accent-green">{formatMoney(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="label">Notas</label>
          <textarea rows={2} className="input resize-none" placeholder="Observaciones para el cliente..." {...register('notas')} />
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={mutation.isPending || !selectedClienteId} className="btn-primary">
            {mutation.isPending ? <><Spinner size={14} /> Creando...</> : 'Crear cotización'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

const FILTER_TABS: { label: string; value: QuoteStatus | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Borrador', value: 'borrador' },
  { label: 'Enviadas', value: 'enviada' },
  { label: 'Aprobadas', value: 'aprobada' },
  { label: 'Rechazadas', value: 'rechazada' },
]

export const QuotesPage = () => {
  const [filter,   setFilter]   = useState<QuoteStatus | 'all'>('all')
  const [modal,    setModal]    = useState(false)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState<any>(null)
  const qc = useQueryClient()
  const user = useAuthStore(s => s.user)

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['quotes', filter],
    queryFn: () => cotizacionesApi.list(filter !== 'all' ? { estado: filter } : undefined),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: QuoteStatus }) =>
      cotizacionesApi.updateStatus(id, estado),
    onSuccess: () => {
      toast.success('Cotización actualizada')
      qc.invalidateQueries({ queryKey: ['quotes'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cotizacionesApi.delete(id),
    onSuccess: () => {
      toast.success('Cotización eliminada')
      qc.invalidateQueries({ queryKey: ['quotes'] })
      setDeleting(null)
    },
  })

  const filtered = quotes.filter(q =>
    !search ||
    q.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
    q.patente?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cotizaciones"
        subtitle={`${filtered.length} cotizaciones`}
        action={
          <button onClick={() => setModal(true)} className="btn-primary">
            <Plus size={15} /> Nueva cotización
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-surface-2 rounded-xl p-1 gap-0.5">
          {FILTER_TABS.map(tab => (
            <button key={tab.value} onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === tab.value ? 'bg-surface-4 text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar cliente, patente..." />
      </div>

      {isLoading ? <FullPageSpinner /> : (
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState message="No hay cotizaciones" icon={FileText} />
          ) : (
            <table className="w-full">
              <thead className="bg-surface-2/50">
                <tr>
                  <th className="th text-left">ID</th>
                  <th className="th text-left">Cliente</th>
                  <th className="th text-left">Vehículo</th>
                  <th className="th text-right">Total</th>
                  <th className="th text-left">Estado</th>
                  <th className="th text-left">Fecha</th>
                  <th className="th text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <tr key={q.id} className="table-row">
                    <td className="td font-mono text-xs text-ink-faint">#{q.id.slice(0, 8)}</td>
                    <td className="td text-sm">{q.cliente_nombre}</td>
                    <td className="td">
                      <p className="text-sm font-mono font-semibold">{q.patente}</p>
                      <p className="text-xs text-ink-faint">{q.marca} {q.modelo}</p>
                    </td>
                    <td className="td text-right font-semibold text-sm">{formatMoney(q.total)}</td>
                    <td className="td"><QuoteBadge status={q.estado} /></td>
                    <td className="td text-xs text-ink-faint">{formatDate(q.created_at)}</td>
                    <td className="td">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => cotizacionesApi.downloadPdf(q.id, `cotizacion-${q.id.slice(0,8)}.pdf`)}
                          className="btn-ghost p-1.5" title="Descargar PDF"
                        >
                          <Download size={13} />
                        </button>
                        {(q.estado === 'enviada' || q.estado === 'borrador') && (
                          <button
                            onClick={() => statusMutation.mutate({ id: q.id, estado: 'aprobada' })}
                            className="btn-ghost p-1.5 text-accent-green hover:bg-accent-green/10" title="Aprobar"
                          >
                            <CheckCircle size={13} />
                          </button>
                        )}
                        {(q.estado === 'enviada' || q.estado === 'borrador') && (
                          <button
                            onClick={() => statusMutation.mutate({ id: q.id, estado: 'rechazada' })}
                            className="btn-ghost p-1.5 text-accent-red hover:bg-accent-red/10" title="Rechazar"
                          >
                            <XCircle size={13} />
                          </button>
                        )}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => setDeleting(q)}
                            className="btn-ghost p-1.5 text-accent-red hover:bg-accent-red/10" title="Eliminar"
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

      <NewQuoteModal open={modal} onClose={() => setModal(false)} />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Eliminar cotización"
        message={`¿Eliminar la cotización #${deleting?.id?.slice(0,8)} de ${deleting?.cliente_nombre}? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}