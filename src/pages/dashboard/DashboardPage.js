import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, ClipboardList, AlertTriangle } from 'lucide-react';
import { adminApi } from '../../api';
import { FullPageSpinner, StatCard, PageHeader } from '../../components/ui';
import { formatMoney, ORDER_STATUS } from '../../lib/utils';
const BAR_COLORS = {
    pendiente: '#f59e0b',
    en_proceso: '#3b82f6',
    terminado: '#10b981',
    entregado: '#475569',
};
export const DashboardPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => adminApi.dashboard(),
        refetchInterval: 60000,
    });
    if (isLoading)
        return _jsx(FullPageSpinner, {});
    const d = data;
    const chartData = d.ordenes_por_estado.map(o => ({
        name: ORDER_STATUS[o.estado]?.label || o.estado,
        total: o.total,
        estado: o.estado,
    }));
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsx(PageHeader, { title: "Dashboard", subtitle: `Período: ${d.periodo.mes}/${d.periodo.anio}` }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatCard, { label: "Ingresos del mes", value: formatMoney(d.ingresos.total_mes), sub: "Cotizaciones aprobadas", color: "text-accent-green" }), _jsx(StatCard, { label: "Promedio por orden", value: formatMoney(d.ingresos.promedio_orden), sub: `${d.ingresos.total_cotizaciones} cotizaciones` }), _jsx(StatCard, { label: "\u00D3rdenes activas", value: d.ordenes_por_estado.find(o => o.estado === 'en_proceso')?.total ?? 0, sub: "En proceso ahora", color: "text-brand-glow" }), _jsx(StatCard, { label: "Repuestos con stock bajo", value: d.alertas_stock_bajo.length, sub: "Requieren reposici\u00F3n", color: d.alertas_stock_bajo.length > 0 ? 'text-accent-amber' : 'text-ink' })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "card p-5 lg:col-span-2", children: [_jsxs("h2", { className: "text-sm font-semibold text-ink mb-4 flex items-center gap-2", children: [_jsx(ClipboardList, { size: 15, className: "text-brand" }), "\u00D3rdenes por estado"] }), chartData.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(BarChart, { data: chartData, barSize: 36, children: [_jsx(XAxis, { dataKey: "name", tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: { fontSize: 12, fill: '#94a3b8' }, axisLine: false, tickLine: false, allowDecimals: false }), _jsx(Tooltip, { contentStyle: { background: '#1c2333', border: '1px solid #1e2a3a', borderRadius: 10, fontSize: 12 }, labelStyle: { color: '#e2e8f0' }, cursor: { fill: 'rgba(59,130,246,0.06)' } }), _jsx(Bar, { dataKey: "total", radius: [6, 6, 0, 0], children: chartData.map((entry, i) => (_jsx(Cell, { fill: BAR_COLORS[entry.estado] || '#3b82f6' }, i))) })] }) })) : (_jsx("p", { className: "text-sm text-ink-muted text-center py-12", children: "Sin datos este mes" }))] }), _jsxs("div", { className: "card p-5", children: [_jsxs("h2", { className: "text-sm font-semibold text-ink mb-4 flex items-center gap-2", children: [_jsx(TrendingUp, { size: 15, className: "text-accent-green" }), "Rendimiento mec\u00E1nicos"] }), _jsxs("div", { className: "space-y-3", children: [d.rendimiento_mecanicos.length === 0 && (_jsx("p", { className: "text-xs text-ink-muted text-center py-6", children: "Sin datos" })), d.rendimiento_mecanicos.map((m, i) => (_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-line last:border-0", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-ink font-medium", children: m.nombre }), _jsxs("p", { className: "text-xs text-ink-faint", children: [m.horas_totales, "h trabajadas"] })] }), _jsx("span", { className: "text-lg font-semibold text-brand-glow", children: m.ordenes_completadas })] }, i)))] })] })] }), d.alertas_stock_bajo.length > 0 && (_jsxs("div", { className: "card p-5", children: [_jsxs("h2", { className: "text-sm font-semibold text-ink mb-4 flex items-center gap-2", children: [_jsx(AlertTriangle, { size: 15, className: "text-accent-amber" }), "Repuestos con stock cr\u00EDtico"] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "th text-left", children: "Repuesto" }), _jsx("th", { className: "th text-left", children: "SKU" }), _jsx("th", { className: "th text-right", children: "Stock actual" }), _jsx("th", { className: "th text-right", children: "Stock m\u00EDnimo" })] }) }), _jsx("tbody", { children: d.alertas_stock_bajo.map(r => (_jsxs("tr", { className: "table-row", children: [_jsx("td", { className: "td font-medium", children: r.nombre }), _jsx("td", { className: "td font-mono text-xs text-ink-muted", children: r.codigo_sku || '—' }), _jsx("td", { className: "td text-right text-accent-red font-semibold", children: r.stock }), _jsx("td", { className: "td text-right text-ink-muted", children: r.stock_minimo })] }, r.id))) })] }) })] }))] }));
};
