import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, ClipboardList, DollarSign, AlertTriangle } from 'lucide-react'
import { adminApi } from '../../api'
import { FullPageSpinner, StatCard, PageHeader } from '../../components/ui'
import { formatMoney, ORDER_STATUS } from '../../lib/utils'

const BAR_COLORS: Record<string, string> = {
  pendiente:  '#f59e0b',
  en_proceso: '#3b82f6',
  terminado:  '#10b981',
  entregado:  '#475569',
}

export const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn:  () => adminApi.dashboard(),
    refetchInterval: 60_000,
  })

  if (isLoading) return <FullPageSpinner />

  const d = data!
  const chartData = (d.ordenes_por_estado ?? []).map(o => ({
  name:  ORDER_STATUS[o.estado]?.label || o.estado,
  total: o.total,
  estado: o.estado,
})) || []
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle={`Período: ${d.periodo?.mes ?? ''}/${d.periodo?.anio ?? ''}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Ingresos del mes"
          value={formatMoney(d.ingresos?.total_mes ?? 0)}
          sub="Cotizaciones aprobadas"
          color="text-accent-green"
        />
        <StatCard
          label="Promedio por orden"
          value={formatMoney(d.ingresos?.promedio_orden ?? 0)}
          sub={`${d.ingresos?.total_cotizaciones ?? 0} cotizaciones`}
        />
        <StatCard
          label="Órdenes activas"
          value={(d.ordenes_por_estado ?? []).find(o => o.estado === 'en_proceso')?.total || 0}
          sub="En proceso ahora"
          color="text-brand-glow"
        />
        <StatCard
          label="Repuestos con stock bajo"
          value={(d.alertas_stock_bajo?.length ?? 0)}
          sub="Requieren reposición"
          color={d.alertas_stock_bajo.length > 0 ? 'text-accent-amber' : 'text-ink'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gráfico órdenes */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
            <ClipboardList size={15} className="text-brand" />
            Órdenes por estado
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={36}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1c2333', border: '1px solid #1e2a3a', borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  cursor={{ fill: 'rgba(59,130,246,0.06)' }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={BAR_COLORS[entry.estado] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-muted text-center py-12">Sin datos este mes</p>
          )}
        </div>

        {/* Mecánicos */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-accent-green" />
            Rendimiento mecánicos
          </h2>
          <div className="space-y-3">
            {(d.rendimiento_mecanicos?.length ?? 0) === 0 && (  
              <p className="text-xs text-ink-muted text-center py-6">Sin datos</p>
            )}
            {(d.rendimiento_mecanicos ?? []).map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                <div>
                  <p className="text-sm text-ink font-medium">{m.nombre}</p>
                  <p className="text-xs text-ink-faint">{m.horas_totales}h trabajadas</p>
                </div>
                <span className="text-lg font-semibold text-brand-glow">{m.ordenes_completadas}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas stock bajo */}
      {(d.alertas_stock_bajo?.length ?? 0) > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
            <AlertTriangle size={15} className="text-accent-amber" />
            Repuestos con stock crítico
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th text-left">Repuesto</th>
                  <th className="th text-left">SKU</th>
                  <th className="th text-right">Stock actual</th>
                  <th className="th text-right">Stock mínimo</th>
                </tr>
              </thead>
              <tbody>
                {d.alertas_stock_bajo.map(r => (
                  <tr key={r.id} className="table-row">
                    <td className="td font-medium">{r.nombre}</td>
                    <td className="td font-mono text-xs text-ink-muted">{r.codigo_sku || '—'}</td>
                    <td className="td text-right text-accent-red font-semibold">{r.stock}</td>
                    <td className="td text-right text-ink-muted">{r.stock_minimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      return (
    </div>
  )
}
