import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordenesApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { PageHeader, OrderBadge, EmptyState, FullPageSpinner, ConfirmDialog, SearchInput, } from '../../components/ui';
import { formatDate, NEXT_STATUS, NEXT_STATUS_LABEL, PRIORITY } from '../../lib/utils';
import { NewOrderModal } from './NewOrderModal';
const FILTER_TABS = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'En proceso', value: 'en_proceso' },
    { label: 'Terminadas', value: 'terminado' },
    { label: 'Entregadas', value: 'entregado' },
];
export const OrdersPage = () => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [newOpen, setNewOpen] = useState(false);
    const [confirmOrder, setConfirmOrder] = useState(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useAuthStore(s => s.user);
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['orders', filter],
        queryFn: () => ordenesApi.list(filter !== 'all' ? { estado: filter } : undefined),
    });
    const statusMutation = useMutation({
        mutationFn: ({ id, estado }) => ordenesApi.updateStatus(id, estado),
        onSuccess: () => {
            toast.success('Estado actualizado');
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setConfirmOrder(null);
        },
    });
    const filtered = orders.filter(o => !search ||
        o.patente?.toLowerCase().includes(search.toLowerCase()) ||
        o.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
        o.mecanico_nombre?.toLowerCase().includes(search.toLowerCase()));
    const handleStatusClick = (e, order) => {
        e.stopPropagation();
        if (!NEXT_STATUS[order.estado])
            return;
        setConfirmOrder(order);
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsx(PageHeader, { title: "\u00D3rdenes de trabajo", subtitle: `${filtered.length} órdenes`, action: user?.role !== 'cliente' && (_jsxs("button", { onClick: () => setNewOpen(true), className: "btn-primary", children: [_jsx(Plus, { size: 15 }), " Nueva orden"] })) }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("div", { className: "flex bg-surface-2 rounded-xl p-1 gap-0.5", children: FILTER_TABS.map(tab => (_jsx("button", { onClick: () => setFilter(tab.value), className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === tab.value
                                ? 'bg-surface-4 text-ink'
                                : 'text-ink-muted hover:text-ink'}`, children: tab.label }, tab.value))) }), _jsx(SearchInput, { value: search, onChange: setSearch, placeholder: "Buscar patente, cliente..." })] }), isLoading ? _jsx(FullPageSpinner, {}) : (_jsx("div", { className: "card overflow-hidden", children: filtered.length === 0 ? (_jsx(EmptyState, { message: "No hay \u00F3rdenes que coincidan", icon: ClipboardList })) : (_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-surface-2/50", children: _jsxs("tr", { children: [_jsx("th", { className: "th text-left", children: "Veh\u00EDculo" }), _jsx("th", { className: "th text-left", children: "Cliente" }), _jsx("th", { className: "th text-left", children: "Mec\u00E1nico" }), _jsx("th", { className: "th text-left", children: "Prioridad" }), _jsx("th", { className: "th text-left", children: "Estado" }), _jsx("th", { className: "th text-left", children: "Ingreso" }), _jsx("th", { className: "th text-left", children: "Acci\u00F3n" }), _jsx("th", { className: "th" })] }) }), _jsx("tbody", { children: filtered.map(order => {
                                const next = NEXT_STATUS[order.estado];
                                const nextLabel = NEXT_STATUS_LABEL[order.estado];
                                const prio = PRIORITY[order.prioridad];
                                return (_jsxs("tr", { className: "table-row cursor-pointer", onClick: () => navigate(`/orders/${order.id}`), children: [_jsxs("td", { className: "td", children: [_jsx("p", { className: "font-semibold font-mono text-sm", children: order.patente }), _jsxs("p", { className: "text-xs text-ink-muted", children: [order.marca, " ", order.modelo] })] }), _jsx("td", { className: "td text-sm", children: order.cliente_nombre }), _jsx("td", { className: "td text-sm text-ink-muted", children: order.mecanico_nombre || '—' }), _jsx("td", { className: "td", children: _jsx("span", { className: `text-xs font-medium ${prio.color}`, children: prio.label }) }), _jsx("td", { className: "td", children: _jsx(OrderBadge, { status: order.estado }) }), _jsx("td", { className: "td text-xs text-ink-muted", children: formatDate(order.fecha_ingreso) }), _jsx("td", { className: "td", children: next && (_jsx("button", { onClick: e => handleStatusClick(e, order), className: "btn-outline text-xs py-1 px-2.5", children: nextLabel })) }), _jsx("td", { className: "td", children: _jsx(ChevronRight, { size: 15, className: "text-ink-faint" }) })] }, order.id));
                            }) })] })) })), _jsx(NewOrderModal, { open: newOpen, onClose: () => setNewOpen(false) }), _jsx(ConfirmDialog, { open: !!confirmOrder, onClose: () => setConfirmOrder(null), onConfirm: () => {
                    if (!confirmOrder)
                        return;
                    const next = NEXT_STATUS[confirmOrder.estado];
                    if (next)
                        statusMutation.mutate({ id: confirmOrder.id, estado: next });
                }, title: "Cambiar estado", message: confirmOrder
                    ? `¿Confirmar "${NEXT_STATUS_LABEL[confirmOrder.estado]}" para el vehículo ${confirmOrder.patente}?`
                    : '', loading: statusMutation.isPending })] }));
};
