import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, ClipboardList, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { ordenesApi } from '../../api'
import { useAuthStore } from '../../stores/authStore'
import {
  PageHeader, OrderBadge, EmptyState, FullPageSpinner,
  ConfirmDialog, SearchInput,
} from '../../components/ui'
import { formatDate, NEXT_STATUS, NEXT_STATUS_LABEL, PRIORITY } from '../../lib/utils'
import type { OrderStatus, OrdenTrabajo } from '../../types'
import { NewOrderModal } from './NewOrderModal'

const FILTER_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Todas',       value: 'all' },
  { label: 'Pendientes',  value: 'pendiente' },
  { label: 'En proceso',  value: 'en_proceso' },
  { label: 'Terminadas',  value: 'terminado' },
  { label: 'Entregadas',  value: 'entregado' },
]

export const OrdersPage = () => {
  const [filter,      setFilter]      = useState<OrderStatus | 'all'>('all')
  const [search,      setSearch]      = useState('')
  const [newOpen,     setNewOpen]     = useState(false)
  const [confirmOrder, setConfirmOrder] = useState<OrdenTrabajo | null>(null)
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()
  const user         = useAuthStore(s => s.user)

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', filter],
    queryFn:  () => ordenesApi.list(filter !== 'all' ? { estado: filter } : undefined),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: OrderStatus }) =>
      ordenesApi.updateStatus(id, estado),
    onSuccess: () => {
      toast.success('Estado actualizado')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setConfirmOrder(null)
    },
  })

  const filtered = orders.filter(o =>
    !search ||
    o.patente?.toLowerCase().includes(search.toLowerCase()) ||
    o.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
    o.mecanico_nombre?.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusClick = (e: React.MouseEvent, order: OrdenTrabajo) => {
    e.stopPropagation()
    if (!NEXT_STATUS[order.estado]) return
    setConfirmOrder(order)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Órdenes de trabajo"
        subtitle={`${filtered.length} órdenes`}
        action={
          user?.role !== 'cliente' && (
            <button onClick={() => setNewOpen(true)} className="btn-primary">
              <Plus size={15} /> Nueva orden
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-surface-2 rounded-xl p-1 gap-0.5">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === tab.value
                  ? 'bg-surface-4 text-ink'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar patente, cliente..." />
      </div>

      {/* Table */}
      {isLoading ? <FullPageSpinner /> : (
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState message="No hay órdenes que coincidan" icon={ClipboardList} />
          ) : (
            <table className="w-full">
              <thead className="bg-surface-2/50">
                <tr>
                  <th className="th text-left">Vehículo</th>
                  <th className="th text-left">Cliente</th>
                  <th className="th text-left">Mecánico</th>
                  <th className="th text-left">Prioridad</th>
                  <th className="th text-left">Estado</th>
                  <th className="th text-left">Ingreso</th>
                  <th className="th text-left">Acción</th>
                  <th className="th" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const next      = NEXT_STATUS[order.estado]
                  const nextLabel = NEXT_STATUS_LABEL[order.estado]
                  const prio      = PRIORITY[order.prioridad]

                  return (
                    <tr
                      key={order.id}
                      className="table-row cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <td className="td">
                        <p className="font-semibold font-mono text-sm">{order.patente}</p>
                        <p className="text-xs text-ink-muted">{order.marca} {order.modelo}</p>
                      </td>
                      <td className="td text-sm">{order.cliente_nombre}</td>
                      <td className="td text-sm text-ink-muted">{order.mecanico_nombre || '—'}</td>
                      <td className="td">
                        <span className={`text-xs font-medium ${prio.color}`}>{prio.label}</span>
                      </td>
                      <td className="td"><OrderBadge status={order.estado} /></td>
                      <td className="td text-xs text-ink-muted">{formatDate(order.fecha_ingreso)}</td>
                      <td className="td">
                        {next && (
                          <button
                            onClick={e => handleStatusClick(e, order)}
                            className="btn-outline text-xs py-1 px-2.5"
                          >
                            {nextLabel}
                          </button>
                        )}
                      </td>
                      <td className="td">
                        <ChevronRight size={15} className="text-ink-faint" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <NewOrderModal open={newOpen} onClose={() => setNewOpen(false)} />

      {/* Confirm status change */}
      <ConfirmDialog
        open={!!confirmOrder}
        onClose={() => setConfirmOrder(null)}
        onConfirm={() => {
          if (!confirmOrder) return
          const next = NEXT_STATUS[confirmOrder.estado]
          if (next) statusMutation.mutate({ id: confirmOrder.id, estado: next })
        }}
        title="Cambiar estado"
        message={
          confirmOrder
            ? `¿Confirmar "${NEXT_STATUS_LABEL[confirmOrder.estado]}" para el vehículo ${confirmOrder.patente}?`
            : ''
        }
        loading={statusMutation.isPending}
      />
    </div>
  )
}
