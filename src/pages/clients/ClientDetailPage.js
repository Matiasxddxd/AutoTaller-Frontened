import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Car, ClipboardList, Phone, Mail, MapPin } from 'lucide-react';
import { clientesApi } from '../../api';
import { FullPageSpinner, PageHeader, OrderBadge } from '../../components/ui';
import { formatDate } from '../../lib/utils';
export const ClientDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: client, isLoading } = useQuery({
        queryKey: ['clients', id],
        queryFn: () => clientesApi.get(id),
        enabled: !!id,
    });
    if (isLoading)
        return _jsx(FullPageSpinner, {});
    if (!client)
        return _jsx("p", { className: "text-ink-muted p-8", children: "Cliente no encontrado" });
    const vehiculos = client.vehiculos ?? [];
    const ordenes = client.ordenes ?? [];
    return (_jsxs("div", { className: "space-y-5 animate-fade-in", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => navigate('/clients'), className: "btn-ghost p-2", children: _jsx(ArrowLeft, { size: 16 }) }), _jsx(PageHeader, { title: client.nombre, subtitle: client.rut ?? 'Sin RUT registrado' })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "card p-5 space-y-3", children: [_jsx("h2", { className: "text-sm font-semibold text-ink mb-3", children: "Datos de contacto" }), client.telefono && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-ink-muted", children: [_jsx(Phone, { size: 14, className: "text-brand" }), client.telefono] })), client.email && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-ink-muted", children: [_jsx(Mail, { size: 14, className: "text-brand" }), client.email] })), client.direccion && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-ink-muted", children: [_jsx(MapPin, { size: 14, className: "text-brand" }), client.direccion] })), client.notas && (_jsxs("div", { className: "bg-surface-3 rounded-xl p-3 mt-2", children: [_jsx("p", { className: "text-xs text-ink-faint mb-1", children: "Notas" }), _jsx("p", { className: "text-sm text-ink-muted", children: client.notas })] })), _jsxs("p", { className: "text-xs text-ink-faint pt-1", children: ["Cliente desde ", formatDate(client.created_at)] })] }), _jsxs("div", { className: "card p-5", children: [_jsxs("h2", { className: "text-sm font-semibold text-ink mb-3 flex items-center gap-2", children: [_jsx(Car, { size: 14, className: "text-brand" }), " Veh\u00EDculos (", vehiculos.length, ")"] }), vehiculos.length === 0 ? (_jsx("p", { className: "text-xs text-ink-faint text-center py-6", children: "Sin veh\u00EDculos registrados" })) : (_jsx("div", { className: "space-y-2", children: vehiculos.map((v) => (_jsxs("div", { onClick: () => navigate(`/vehicles/${v.id}`), className: "flex items-center justify-between p-3 bg-surface-2 rounded-xl cursor-pointer hover:bg-surface-3 transition-colors", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold font-mono", children: v.patente }), _jsxs("p", { className: "text-xs text-ink-muted", children: [v.marca, " ", v.modelo, " ", v.anio] })] }), _jsx("span", { className: "text-xs text-ink-faint", children: v.color })] }, v.id))) }))] }), _jsxs("div", { className: "card p-5", children: [_jsxs("h2", { className: "text-sm font-semibold text-ink mb-3 flex items-center gap-2", children: [_jsx(ClipboardList, { size: 14, className: "text-brand" }), " \u00DAltimas \u00F3rdenes"] }), ordenes.length === 0 ? (_jsx("p", { className: "text-xs text-ink-faint text-center py-6", children: "Sin \u00F3rdenes" })) : (_jsx("div", { className: "space-y-2", children: ordenes.map((o) => (_jsxs("div", { onClick: () => navigate(`/orders/${o.id}`), className: "p-3 bg-surface-2 rounded-xl cursor-pointer hover:bg-surface-3 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("p", { className: "text-xs font-mono text-ink-muted", children: o.patente }), _jsx(OrderBadge, { status: o.estado })] }), _jsx("p", { className: "text-xs text-ink-faint", children: formatDate(o.fecha_ingreso) })] }, o.id))) }))] })] })] }));
};
