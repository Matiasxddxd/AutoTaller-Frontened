import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Car, User, Wrench, Clock, Plus, CheckCircle2, Circle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ordenesApi } from '../../api'
import { useOrderSocket } from '../../hooks/useOrderSocket'
import {
  FullPageSpinner, OrderBadge, PageHeader, Modal, Spinner, ConfirmDialog,
} from '../../components/ui'
import {
  formatDate, formatDateTime, formatMoney,
  NEXT_STATUS, NEXT_STATUS_LABEL, ORDER_STATUS, PRIORITY,
} from '../../lib/utils'
import type { OrderStatus } from '../../types'

export const OrderDetailPage = () => {
  const { id }        = useParams<{ id: string }>()
  const navigate      = useNavigate()
  const qc            = useQueryClient()
  const [serviceOpen, setServiceOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<{ descripcion: string; observaciones?: string; horas_trabajo?: number }>()

  useOrderSocket(id)

  const { data: order, isLoading } = useQuery({
    queryKey: ['orders', id],
    queryFn:  () => ordenesApi.get(id!),
    enabled:  !!id,
  })

  const statusMutation = useMutation({
    mutationFn: (estado: OrderStatus) => ordenesApi.updateStatus(id!, estado),
    onSuccess: () => {
      toast.success('Estado actualizado')
      qc.invalidateQueries({ queryKey: ['orders', id] })
      qc.invalidateQueries({ queryKey: ['orders'] })
      setConfirmOpen(false)
    },
  })

  const serviceMutation = useMutation({
    mutationFn: (data: { descripcion: string; observaciones?: string; horas_trabajo?: number }) =>
      ordenesApi.addService(id!, data),
    onSuccess: () => {
      toast.success('Servicio registrado')
      qc.invalidateQueries({ queryKey: ['orders', id] })
      reset(); setServiceOpen(false)
    },
  })

  if (isLoading) return <FullPageSpinner />
  if (!order)    return <p className="text-ink-muted p-8">Orden no encontrada</p>

  const next      = NEXT_STATUS[order.estado]
  const nextLabel = NEXT_STATUS_LABEL[order.estado]
  const prio      = PRIORITY[order.prioridad]

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate('/orders')} className="btn-ghost p-2">
          <ArrowLeft size={16} />
        </button>
        <PageHeader
          title={`OT — ${order.patente}`}
          subtitle={`${order.marca} ${order.modelo} ${order.anio ?? ''}`}
          action={
            <div className="flex items-center gap-2">
              <OrderBadge status={order.estado} />
              {next && (
                <button onClick={() => setConfirmOpen(true)} className="btn-primary">
                  {nextLabel}
                </button>
              )}
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Datos principales */}
          <div className="card p-5 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Car size={16} className="text-brand mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-faint mb-0.5">Vehículo</p>
                <p className="text-sm font-semibold font-mono">{order.patente}</p>
                <p className="text-xs text-ink-muted">{order.marca} {order.modelo} · {order.color}</p>
                {order.kilometraje_ingreso && (
                  <p className="text-xs text-ink-faint">{order.kilometraje_ingreso.toLocaleString()} km</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={16} className="text-accent-purple mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-faint mb-0.5">Cliente</p>
                <p className="text-sm font-semibold">{order.cliente_nombre}</p>
                <p className="text-xs text-ink-muted">{order.cliente_telefono}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wrench size={16} className="text-accent-green mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-faint mb-0.5">Mecánico asignado</p>
                <p className="text-sm">{order.mecanico_nombre || <span className="text-ink-faint">Sin asignar</span>}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-accent-amber mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-ink-faint mb-0.5">Fechas</p>
                <p className="text-xs text-ink-muted">Ingreso: {formatDate(order.fecha_ingreso)}</p>
                {order.fecha_estimada && (
                  <p className="text-xs text-ink-muted">Estimada: {formatDate(order.fecha_estimada)}</p>
                )}
                {order.fecha_entrega && (
                  <p className="text-xs text-accent-green">Entrega: {formatDateTime(order.fecha_entrega)}</p>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-ink-faint mb-1">Prioridad</p>
              <span className={`text-sm font-medium ${prio.color}`}>{prio.label}</span>
            </div>
            {order.diagnostico && (
              <div className="col-span-2">
                <p className="text-xs text-ink-faint mb-1">Diagnóstico</p>
                <p className="text-sm text-ink-muted leading-relaxed">{order.diagnostico}</p>
              </div>
            )}
            {order.notas_internas && (
              <div className="col-span-2 bg-surface-3 rounded-xl p-3">
                <p className="text-xs text-ink-faint mb-1">Notas internas</p>
                <p className="text-sm text-ink-muted">{order.notas_internas}</p>
              </div>
            )}
          </div>

          {/* Servicios realizados */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-ink">Servicios realizados</h2>
              {order.estado !== 'entregado' && (
                <button onClick={() => setServiceOpen(true)} className="btn-ghost text-xs">
                  <Plus size={13} /> Agregar
                </button>
              )}
            </div>
            {(!order.servicios || order.servicios.length === 0) ? (
              <p className="text-xs text-ink-faint text-center py-6">Sin servicios registrados aún</p>
            ) : (
              <div className="space-y-3">
                {order.servicios.map(s => (
                  <div key={s.id} className="border-l-2 border-brand/40 pl-3 py-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ink">{s.descripcion}</p>
                      {s.horas_trabajo && (
                        <span className="text-xs text-ink-faint">{s.horas_trabajo}h</span>
                      )}
                    </div>
                    {s.observaciones && <p className="text-xs text-ink-muted mt-0.5">{s.observaciones}</p>}
                    <p className="text-xs text-ink-faint mt-1">
                      {s.mecanico_nombre && `${s.mecanico_nombre} · `}{formatDateTime(s.fecha_hora)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — historial */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Historial de estados</h2>
          {(!order.historial || order.historial.length === 0) ? (
            <p className="text-xs text-ink-faint text-center py-6">Sin historial</p>
          ) : (
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-line" />
              <div className="space-y-4">
                {order.historial.map((h, i) => {
                  const isLast   = i === order.historial!.length - 1
                  const stateCfg = ORDER_STATUS[h.estado_nuevo as OrderStatus]
                  return (
                    <div key={h.id} className="flex gap-3 relative">
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center z-10 ${
                        isLast
                          ? 'border-brand bg-brand/20'
                          : 'border-line bg-surface-1'
                      }`}>
                        {isLast
                          ? <div className="w-2 h-2 rounded-full bg-brand" />
                          : <div className="w-1.5 h-1.5 rounded-full bg-ink-faint" />
                        }
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-xs font-medium text-ink capitalize">
                          {stateCfg?.label || h.estado_nuevo}
                        </p>
                        {h.comentario && (
                          <p className="text-xs text-ink-muted mt-0.5">{h.comentario}</p>
                        )}
                        <p className="text-xs text-ink-faint mt-0.5">{formatDateTime(h.created_at)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal — agregar servicio */}
      <Modal open={serviceOpen} onClose={() => setServiceOpen(false)} title="Registrar servicio" size="md">
        <form onSubmit={handleSubmit(d => serviceMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="label">Descripción del trabajo</label>
            <input className="input" placeholder="Cambio de aceite y filtro..." {...register('descripcion', { required: true })} />
          </div>
          <div>
            <label className="label">Observaciones técnicas</label>
            <textarea rows={3} className="input resize-none" placeholder="Detalles adicionales..." {...register('observaciones')} />
          </div>
          <div>
            <label className="label">Horas de trabajo</label>
            <input type="number" step="0.5" min="0" className="input" placeholder="1.5" {...register('horas_trabajo')} />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={() => setServiceOpen(false)} className="btn-ghost">Cancelar</button>
            <button type="submit" disabled={serviceMutation.isPending} className="btn-primary">
              {serviceMutation.isPending ? <><Spinner size={14} /> Guardando...</> : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm status */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { if (next) statusMutation.mutate(next) }}
        title="Cambiar estado"
        message={`¿Confirmar "${nextLabel}" para esta orden?`}
        loading={statusMutation.isPending}
      />
    </div>
  )
}
