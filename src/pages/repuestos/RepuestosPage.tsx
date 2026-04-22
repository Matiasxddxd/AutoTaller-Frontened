import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Package, AlertTriangle, Minus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { repuestosApi } from '../../api'
import { PageHeader, EmptyState, FullPageSpinner, Modal, Spinner, SearchInput } from '../../components/ui'
import { formatMoney } from '../../lib/utils'
import type { Repuesto } from '../../types'

const RepuestoModal = ({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Repuesto }) => {
  const qc = useQueryClient()
  const { register, handleSubmit, reset } = useForm<Partial<Repuesto>>({ defaultValues: initial })

  const mutation = useMutation({
    mutationFn: (data: Partial<Repuesto>) =>
      initial ? repuestosApi.update(initial.id, data) : repuestosApi.create(data),
    onSuccess: () => {
      toast.success(initial ? 'Repuesto actualizado' : 'Repuesto creado')
      qc.invalidateQueries({ queryKey: ['repuestos'] })
      reset(); onClose()
    },
  })

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Editar repuesto' : 'Nuevo repuesto'} size="md">
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Nombre *</label>
            <input className="input" placeholder="Filtro de aceite Toyota" {...register('nombre', { required: true })} />
          </div>
          <div>
            <label className="label">Código SKU</label>
            <input className="input" placeholder="FIL-ACE-001" {...register('codigo_sku')} />
          </div>
          <div>
            <label className="label">Unidad</label>
            <select className="input" {...register('unidad')}>
              <option value="unidad">Unidad</option>
              <option value="litro">Litro</option>
              <option value="juego">Juego</option>
              <option value="metro">Metro</option>
              <option value="kg">Kilogramo</option>
            </select>
          </div>
          <div>
            <label className="label">Precio costo</label>
            <input type="number" min="0" className="input" placeholder="3500" {...register('precio_costo')} />
          </div>
          <div>
            <label className="label">Precio venta *</label>
            <input type="number" min="0" className="input" placeholder="8000" {...register('precio_venta', { required: true })} />
          </div>
          <div>
            <label className="label">Stock inicial</label>
            <input type="number" min="0" className="input" placeholder="10" {...register('stock')} />
          </div>
          <div>
            <label className="label">Stock mínimo</label>
            <input type="number" min="0" className="input" placeholder="2" {...register('stock_minimo')} />
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

const AdjustStockModal = ({ open, onClose, repuesto }: { open: boolean; onClose: () => void; repuesto: Repuesto | null }) => {
  const qc = useQueryClient()
  const { register, handleSubmit, reset } = useForm<{ cantidad: number; motivo: string }>()

  const mutation = useMutation({
    mutationFn: ({ cantidad, motivo }: { cantidad: number; motivo: string }) =>
      repuestosApi.adjustStock(repuesto!.id, cantidad, motivo),
    onSuccess: () => {
      toast.success('Stock actualizado')
      qc.invalidateQueries({ queryKey: ['repuestos'] })
      reset(); onClose()
    },
  })

  return (
    <Modal open={open} onClose={onClose} title={`Ajustar stock — ${repuesto?.nombre}`} size="sm">
      <p className="text-sm text-ink-muted mb-4">
        Stock actual: <span className="font-semibold text-ink">{repuesto?.stock} {repuesto?.unidad}</span>
      </p>
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="label">Cantidad (positivo = entrada, negativo = salida)</label>
          <input type="number" className="input" placeholder="5 o -3" {...register('cantidad', { required: true, valueAsNumber: true })} />
        </div>
        <div>
          <label className="label">Motivo</label>
          <input className="input" placeholder="Compra, uso en OT #123..." {...register('motivo')} />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? <Spinner size={14} /> : 'Actualizar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export const RepuestosPage = () => {
  const [search,      setSearch]      = useState('')
  const [stockBajo,   setStockBajo]   = useState(false)
  const [modal,       setModal]       = useState(false)
  const [editing,     setEditing]     = useState<Repuesto | undefined>()
  const [adjusting,   setAdjusting]   = useState<Repuesto | null>(null)

  const { data: repuestos = [], isLoading } = useQuery({
    queryKey: ['repuestos', search, stockBajo],
    queryFn:  () => repuestosApi.list({ search, stock_bajo: stockBajo || undefined }),
  })

  const lowStock = repuestos.filter(r => r.stock_critico).length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Repuestos e inventario"
        subtitle={`${repuestos.length} productos`}
        action={
          <button onClick={() => { setEditing(undefined); setModal(true) }} className="btn-primary">
            <Plus size={15} /> Nuevo repuesto
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar nombre, SKU..." />
        <button
          onClick={() => setStockBajo(v => !v)}
          className={`btn-outline text-xs flex items-center gap-1.5 ${stockBajo ? 'border-accent-amber text-accent-amber' : ''}`}
        >
          <AlertTriangle size={13} />
          {lowStock > 0 && <span className="bg-accent-amber text-surface text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{lowStock}</span>}
          Stock crítico
        </button>
      </div>

      {isLoading ? <FullPageSpinner /> : (
        <div className="card overflow-hidden">
          {repuestos.length === 0 ? (
            <EmptyState message="No se encontraron repuestos" icon={Package} />
          ) : (
            <table className="w-full">
              <thead className="bg-surface-2/50">
                <tr>
                  <th className="th text-left">Nombre</th>
                  <th className="th text-left">SKU</th>
                  <th className="th text-right">Costo</th>
                  <th className="th text-right">Venta</th>
                  <th className="th text-right">Margen</th>
                  <th className="th text-center">Stock</th>
                  <th className="th text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {repuestos.map(r => {
                  const margen = r.precio_costo > 0
                    ? Math.round(((r.precio_venta - r.precio_costo) / r.precio_costo) * 100)
                    : null
                  return (
                    <tr key={r.id} className="table-row">
                      <td className="td">
                        <div className="flex items-center gap-2">
                          {r.stock_critico && <AlertTriangle size={13} className="text-accent-amber shrink-0" />}
                          <span className="text-sm font-medium text-ink">{r.nombre}</span>
                        </div>
                        <p className="text-xs text-ink-faint">{r.unidad}</p>
                      </td>
                      <td className="td font-mono text-xs text-ink-muted">{r.codigo_sku || '—'}</td>
                      <td className="td text-right text-sm text-ink-muted">{formatMoney(r.precio_costo)}</td>
                      <td className="td text-right text-sm font-medium">{formatMoney(r.precio_venta)}</td>
                      <td className="td text-right text-xs">
                        {margen !== null ? (
                          <span className={margen >= 30 ? 'text-accent-green' : 'text-accent-amber'}>
                            {margen}%
                          </span>
                        ) : '—'}
                      </td>
                      <td className="td text-center">
                        <span className={`text-sm font-semibold ${r.stock_critico ? 'text-accent-red' : 'text-ink'}`}>
                          {r.stock}
                        </span>
                        <span className="text-xs text-ink-faint ml-1">/ mín {r.stock_minimo}</span>
                      </td>
                      <td className="td">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setAdjusting(r)}
                            className="btn-ghost text-xs py-1 px-2"
                          >
                            Ajustar stock
                          </button>
                          <button
                            onClick={() => { setEditing(r); setModal(true) }}
                            className="btn-ghost text-xs py-1 px-2"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <RepuestoModal open={modal} onClose={() => setModal(false)} initial={editing} />
      <AdjustStockModal open={!!adjusting} onClose={() => setAdjusting(null)} repuesto={adjusting} />
    </div>
  )
}
