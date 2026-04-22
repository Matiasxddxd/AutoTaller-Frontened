import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Car, ClipboardList, Phone, Mail, MapPin } from 'lucide-react'
import { clientesApi } from '../../api'
import { FullPageSpinner, PageHeader, OrderBadge } from '../../components/ui'
import { formatDate } from '../../lib/utils'

export const ClientDetailPage = () => {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: client, isLoading } = useQuery({
    queryKey: ['clients', id],
    queryFn:  () => clientesApi.get(id!),
    enabled:  !!id,
  })

  if (isLoading) return <FullPageSpinner />
  if (!client)   return <p className="text-ink-muted p-8">Cliente no encontrado</p>

  const vehiculos = (client as any).vehiculos ?? []
  const ordenes   = (client as any).ordenes   ?? []

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/clients')} className="btn-ghost p-2">
          <ArrowLeft size={16} />
        </button>
        <PageHeader title={client.nombre} subtitle={client.rut ?? 'Sin RUT registrado'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Info personal */}
        <div className="card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-ink mb-3">Datos de contacto</h2>
          {client.telefono && (
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Phone size={14} className="text-brand" />{client.telefono}
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Mail size={14} className="text-brand" />{client.email}
            </div>
          )}
          {client.direccion && (
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <MapPin size={14} className="text-brand" />{client.direccion}
            </div>
          )}
          {client.notas && (
            <div className="bg-surface-3 rounded-xl p-3 mt-2">
              <p className="text-xs text-ink-faint mb-1">Notas</p>
              <p className="text-sm text-ink-muted">{client.notas}</p>
            </div>
          )}
          <p className="text-xs text-ink-faint pt-1">Cliente desde {formatDate(client.created_at)}</p>
        </div>

        {/* Vehículos */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <Car size={14} className="text-brand" /> Vehículos ({vehiculos.length})
          </h2>
          {vehiculos.length === 0 ? (
            <p className="text-xs text-ink-faint text-center py-6">Sin vehículos registrados</p>
          ) : (
            <div className="space-y-2">
              {vehiculos.map((v: any) => (
                <div
                  key={v.id}
                  onClick={() => navigate(`/vehicles/${v.id}`)}
                  className="flex items-center justify-between p-3 bg-surface-2 rounded-xl cursor-pointer hover:bg-surface-3 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold font-mono">{v.patente}</p>
                    <p className="text-xs text-ink-muted">{v.marca} {v.modelo} {v.anio}</p>
                  </div>
                  <span className="text-xs text-ink-faint">{v.color}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimas órdenes */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <ClipboardList size={14} className="text-brand" /> Últimas órdenes
          </h2>
          {ordenes.length === 0 ? (
            <p className="text-xs text-ink-faint text-center py-6">Sin órdenes</p>
          ) : (
            <div className="space-y-2">
              {ordenes.map((o: any) => (
                <div
                  key={o.id}
                  onClick={() => navigate(`/orders/${o.id}`)}
                  className="p-3 bg-surface-2 rounded-xl cursor-pointer hover:bg-surface-3 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-mono text-ink-muted">{o.patente}</p>
                    <OrderBadge status={o.estado} />
                  </div>
                  <p className="text-xs text-ink-faint">{formatDate(o.fecha_ingreso)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
