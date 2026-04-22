import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Car, User, Wrench, Clock, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ordenesApi } from '../../api';
import { useOrderSocket } from '../../hooks/useOrderSocket';
import { FullPageSpinner, OrderBadge, PageHeader, Modal, Spinner, ConfirmDialog, } from '../../components/ui';
import { formatDate, formatDateTime, NEXT_STATUS, NEXT_STATUS_LABEL, ORDER_STATUS, PRIORITY, } from '../../lib/utils';
export const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [serviceOpen, setServiceOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    useOrderSocket(id);
    const { data: order, isLoading } = useQuery({
        queryKey: ['orders', id],
        queryFn: () => ordenesApi.get(id),
        enabled: !!id,
    });
    const statusMutation = useMutation({
        mutationFn: (estado) => ordenesApi.updateStatus(id, estado),
        onSuccess: () => {
            toast.success('Estado actualizado');
            qc.invalidateQueries({ queryKey: ['orders', id] });
            qc.invalidateQueries({ queryKey: ['orders'] });
            setConfirmOpen(false);
        },
    });
    const serviceMutation = useMutation({
        mutationFn: (data) => ordenesApi.addService(id, data),
        onSuccess: () => {
            toast.success('Servicio registrado');
            qc.invalidateQueries({ queryKey: ['orders', id] });
            reset();
            setServiceOpen(false);
        },
    });
    if (isLoading)
        return _jsx(FullPageSpinner, {});
    if (!order)
        return _jsx("p", { className: "text-ink-muted p-8", children: "Orden no encontrada" });
    const next = NEXT_STATUS[order.estado];
    const nextLabel = NEXT_STATUS_LABEL[order.estado];
    const prio = PRIORITY[order.prioridad];
    return (_jsxs("div", { className: "space-y-5 animate-fade-in", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("button", { onClick: () => navigate('/orders'), className: "btn-ghost p-2", children: _jsx(ArrowLeft, { size: 16 }) }), _jsx(PageHeader, { title: `OT — ${order.patente}`, subtitle: `${order.marca} ${order.modelo} ${order.anio ?? ''}`, action: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(OrderBadge, { status: order.estado }), next && (_jsx("button", { onClick: () => setConfirmOpen(true), className: "btn-primary", children: nextLabel }))] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsxs("div", { className: "card p-5 grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Car, { size: 16, className: "text-brand mt-0.5 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-ink-faint mb-0.5", children: "Veh\u00EDculo" }), _jsx("p", { className: "text-sm font-semibold font-mono", children: order.patente }), _jsxs("p", { className: "text-xs text-ink-muted", children: [order.marca, " ", order.modelo, " \u00B7 ", order.color] }), order.kilometraje_ingreso && (_jsxs("p", { className: "text-xs text-ink-faint", children: [order.kilometraje_ingreso.toLocaleString(), " km"] }))] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(User, { size: 16, className: "text-accent-purple mt-0.5 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-ink-faint mb-0.5", children: "Cliente" }), _jsx("p", { className: "text-sm font-semibold", children: order.cliente_nombre }), _jsx("p", { className: "text-xs text-ink-muted", children: order.cliente_telefono })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Wrench, { size: 16, className: "text-accent-green mt-0.5 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-ink-faint mb-0.5", children: "Mec\u00E1nico asignado" }), _jsx("p", { className: "text-sm", children: order.mecanico_nombre || _jsx("span", { className: "text-ink-faint", children: "Sin asignar" }) })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Clock, { size: 16, className: "text-accent-amber mt-0.5 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-ink-faint mb-0.5", children: "Fechas" }), _jsxs("p", { className: "text-xs text-ink-muted", children: ["Ingreso: ", formatDate(order.fecha_ingreso)] }), order.fecha_estimada && (_jsxs("p", { className: "text-xs text-ink-muted", children: ["Estimada: ", formatDate(order.fecha_estimada)] })), order.fecha_entrega && (_jsxs("p", { className: "text-xs text-accent-green", children: ["Entrega: ", formatDateTime(order.fecha_entrega)] }))] })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("p", { className: "text-xs text-ink-faint mb-1", children: "Prioridad" }), _jsx("span", { className: `text-sm font-medium ${prio.color}`, children: prio.label })] }), order.diagnostico && (_jsxs("div", { className: "col-span-2", children: [_jsx("p", { className: "text-xs text-ink-faint mb-1", children: "Diagn\u00F3stico" }), _jsx("p", { className: "text-sm text-ink-muted leading-relaxed", children: order.diagnostico })] })), order.notas_internas && (_jsxs("div", { className: "col-span-2 bg-surface-3 rounded-xl p-3", children: [_jsx("p", { className: "text-xs text-ink-faint mb-1", children: "Notas internas" }), _jsx("p", { className: "text-sm text-ink-muted", children: order.notas_internas })] }))] }), _jsxs("div", { className: "card p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-sm font-semibold text-ink", children: "Servicios realizados" }), order.estado !== 'entregado' && (_jsxs("button", { onClick: () => setServiceOpen(true), className: "btn-ghost text-xs", children: [_jsx(Plus, { size: 13 }), " Agregar"] }))] }), (!order.servicios || order.servicios.length === 0) ? (_jsx("p", { className: "text-xs text-ink-faint text-center py-6", children: "Sin servicios registrados a\u00FAn" })) : (_jsx("div", { className: "space-y-3", children: order.servicios.map(s => (_jsxs("div", { className: "border-l-2 border-brand/40 pl-3 py-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-ink", children: s.descripcion }), s.horas_trabajo && (_jsxs("span", { className: "text-xs text-ink-faint", children: [s.horas_trabajo, "h"] }))] }), s.observaciones && _jsx("p", { className: "text-xs text-ink-muted mt-0.5", children: s.observaciones }), _jsxs("p", { className: "text-xs text-ink-faint mt-1", children: [s.mecanico_nombre && `${s.mecanico_nombre} · `, formatDateTime(s.fecha_hora)] })] }, s.id))) }))] })] }), _jsxs("div", { className: "card p-5", children: [_jsx("h2", { className: "text-sm font-semibold text-ink mb-4", children: "Historial de estados" }), (!order.historial || order.historial.length === 0) ? (_jsx("p", { className: "text-xs text-ink-faint text-center py-6", children: "Sin historial" })) : (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-[11px] top-2 bottom-2 w-px bg-line" }), _jsx("div", { className: "space-y-4", children: order.historial.map((h, i) => {
                                            const isLast = i === order.historial.length - 1;
                                            const stateCfg = ORDER_STATUS[h.estado_nuevo];
                                            return (_jsxs("div", { className: "flex gap-3 relative", children: [_jsx("div", { className: `w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center z-10 ${isLast
                                                            ? 'border-brand bg-brand/20'
                                                            : 'border-line bg-surface-1'}`, children: isLast
                                                            ? _jsx("div", { className: "w-2 h-2 rounded-full bg-brand" })
                                                            : _jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-ink-faint" }) }), _jsxs("div", { className: "flex-1 pb-1", children: [_jsx("p", { className: "text-xs font-medium text-ink capitalize", children: stateCfg?.label || h.estado_nuevo }), h.comentario && (_jsx("p", { className: "text-xs text-ink-muted mt-0.5", children: h.comentario })), _jsx("p", { className: "text-xs text-ink-faint mt-0.5", children: formatDateTime(h.created_at) })] })] }, h.id));
                                        }) })] }))] })] }), _jsx(Modal, { open: serviceOpen, onClose: () => setServiceOpen(false), title: "Registrar servicio", size: "md", children: _jsxs("form", { onSubmit: handleSubmit(d => serviceMutation.mutate(d)), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Descripci\u00F3n del trabajo" }), _jsx("input", { className: "input", placeholder: "Cambio de aceite y filtro...", ...register('descripcion', { required: true }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Observaciones t\u00E9cnicas" }), _jsx("textarea", { rows: 3, className: "input resize-none", placeholder: "Detalles adicionales...", ...register('observaciones') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Horas de trabajo" }), _jsx("input", { type: "number", step: "0.5", min: "0", className: "input", placeholder: "1.5", ...register('horas_trabajo') })] }), _jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [_jsx("button", { type: "button", onClick: () => setServiceOpen(false), className: "btn-ghost", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: serviceMutation.isPending, className: "btn-primary", children: serviceMutation.isPending ? _jsxs(_Fragment, { children: [_jsx(Spinner, { size: 14 }), " Guardando..."] }) : 'Registrar' })] })] }) }), _jsx(ConfirmDialog, { open: confirmOpen, onClose: () => setConfirmOpen(false), onConfirm: () => { if (next)
                    statusMutation.mutate(next); }, title: "Cambiar estado", message: `¿Confirmar "${nextLabel}" para esta orden?`, loading: statusMutation.isPending })] }));
};
