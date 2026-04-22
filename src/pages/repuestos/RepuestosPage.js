import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { repuestosApi } from '../../api';
import { PageHeader, EmptyState, FullPageSpinner, Modal, Spinner, SearchInput } from '../../components/ui';
import { formatMoney } from '../../lib/utils';
const RepuestoModal = ({ open, onClose, initial }) => {
    const qc = useQueryClient();
    const { register, handleSubmit, reset } = useForm({ defaultValues: initial });
    const mutation = useMutation({
        mutationFn: (data) => initial ? repuestosApi.update(initial.id, data) : repuestosApi.create(data),
        onSuccess: () => {
            toast.success(initial ? 'Repuesto actualizado' : 'Repuesto creado');
            qc.invalidateQueries({ queryKey: ['repuestos'] });
            reset();
            onClose();
        },
    });
    return (_jsx(Modal, { open: open, onClose: onClose, title: initial ? 'Editar repuesto' : 'Nuevo repuesto', size: "md", children: _jsxs("form", { onSubmit: handleSubmit(d => mutation.mutate(d)), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Nombre *" }), _jsx("input", { className: "input", placeholder: "Filtro de aceite Toyota", ...register('nombre', { required: true }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "C\u00F3digo SKU" }), _jsx("input", { className: "input", placeholder: "FIL-ACE-001", ...register('codigo_sku') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Unidad" }), _jsxs("select", { className: "input", ...register('unidad'), children: [_jsx("option", { value: "unidad", children: "Unidad" }), _jsx("option", { value: "litro", children: "Litro" }), _jsx("option", { value: "juego", children: "Juego" }), _jsx("option", { value: "metro", children: "Metro" }), _jsx("option", { value: "kg", children: "Kilogramo" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Precio costo" }), _jsx("input", { type: "number", min: "0", className: "input", placeholder: "3500", ...register('precio_costo') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Precio venta *" }), _jsx("input", { type: "number", min: "0", className: "input", placeholder: "8000", ...register('precio_venta', { required: true }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Stock inicial" }), _jsx("input", { type: "number", min: "0", className: "input", placeholder: "10", ...register('stock') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Stock m\u00EDnimo" }), _jsx("input", { type: "number", min: "0", className: "input", placeholder: "2", ...register('stock_minimo') })] })] }), _jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-ghost", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: mutation.isPending, className: "btn-primary", children: mutation.isPending ? _jsxs(_Fragment, { children: [_jsx(Spinner, { size: 14 }), " Guardando..."] }) : 'Guardar' })] })] }) }));
};
const AdjustStockModal = ({ open, onClose, repuesto }) => {
    const qc = useQueryClient();
    const { register, handleSubmit, reset } = useForm();
    const mutation = useMutation({
        mutationFn: ({ cantidad, motivo }) => repuestosApi.adjustStock(repuesto.id, cantidad, motivo),
        onSuccess: () => {
            toast.success('Stock actualizado');
            qc.invalidateQueries({ queryKey: ['repuestos'] });
            reset();
            onClose();
        },
    });
    return (_jsxs(Modal, { open: open, onClose: onClose, title: `Ajustar stock — ${repuesto?.nombre}`, size: "sm", children: [_jsxs("p", { className: "text-sm text-ink-muted mb-4", children: ["Stock actual: ", _jsxs("span", { className: "font-semibold text-ink", children: [repuesto?.stock, " ", repuesto?.unidad] })] }), _jsxs("form", { onSubmit: handleSubmit(d => mutation.mutate(d)), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Cantidad (positivo = entrada, negativo = salida)" }), _jsx("input", { type: "number", className: "input", placeholder: "5 o -3", ...register('cantidad', { required: true, valueAsNumber: true }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Motivo" }), _jsx("input", { className: "input", placeholder: "Compra, uso en OT #123...", ...register('motivo') })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-ghost", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: mutation.isPending, className: "btn-primary", children: mutation.isPending ? _jsx(Spinner, { size: 14 }) : 'Actualizar' })] })] })] }));
};
export const RepuestosPage = () => {
    const [search, setSearch] = useState('');
    const [stockBajo, setStockBajo] = useState(false);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState();
    const [adjusting, setAdjusting] = useState(null);
    const { data: repuestos = [], isLoading } = useQuery({
        queryKey: ['repuestos', search, stockBajo],
        queryFn: () => repuestosApi.list({ search, stock_bajo: stockBajo || undefined }),
    });
    const lowStock = repuestos.filter(r => r.stock_critico).length;
    return (_jsxs("div", { className: "space-y-5", children: [_jsx(PageHeader, { title: "Repuestos e inventario", subtitle: `${repuestos.length} productos`, action: _jsxs("button", { onClick: () => { setEditing(undefined); setModal(true); }, className: "btn-primary", children: [_jsx(Plus, { size: 15 }), " Nuevo repuesto"] }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx(SearchInput, { value: search, onChange: setSearch, placeholder: "Buscar nombre, SKU..." }), _jsxs("button", { onClick: () => setStockBajo(v => !v), className: `btn-outline text-xs flex items-center gap-1.5 ${stockBajo ? 'border-accent-amber text-accent-amber' : ''}`, children: [_jsx(AlertTriangle, { size: 13 }), lowStock > 0 && _jsx("span", { className: "bg-accent-amber text-surface text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold", children: lowStock }), "Stock cr\u00EDtico"] })] }), isLoading ? _jsx(FullPageSpinner, {}) : (_jsx("div", { className: "card overflow-hidden", children: repuestos.length === 0 ? (_jsx(EmptyState, { message: "No se encontraron repuestos", icon: Package })) : (_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-surface-2/50", children: _jsxs("tr", { children: [_jsx("th", { className: "th text-left", children: "Nombre" }), _jsx("th", { className: "th text-left", children: "SKU" }), _jsx("th", { className: "th text-right", children: "Costo" }), _jsx("th", { className: "th text-right", children: "Venta" }), _jsx("th", { className: "th text-right", children: "Margen" }), _jsx("th", { className: "th text-center", children: "Stock" }), _jsx("th", { className: "th text-left", children: "Acciones" })] }) }), _jsx("tbody", { children: repuestos.map(r => {
                                const margen = r.precio_costo > 0
                                    ? Math.round(((r.precio_venta - r.precio_costo) / r.precio_costo) * 100)
                                    : null;
                                return (_jsxs("tr", { className: "table-row", children: [_jsxs("td", { className: "td", children: [_jsxs("div", { className: "flex items-center gap-2", children: [r.stock_critico && _jsx(AlertTriangle, { size: 13, className: "text-accent-amber shrink-0" }), _jsx("span", { className: "text-sm font-medium text-ink", children: r.nombre })] }), _jsx("p", { className: "text-xs text-ink-faint", children: r.unidad })] }), _jsx("td", { className: "td font-mono text-xs text-ink-muted", children: r.codigo_sku || '—' }), _jsx("td", { className: "td text-right text-sm text-ink-muted", children: formatMoney(r.precio_costo) }), _jsx("td", { className: "td text-right text-sm font-medium", children: formatMoney(r.precio_venta) }), _jsx("td", { className: "td text-right text-xs", children: margen !== null ? (_jsxs("span", { className: margen >= 30 ? 'text-accent-green' : 'text-accent-amber', children: [margen, "%"] })) : '—' }), _jsxs("td", { className: "td text-center", children: [_jsx("span", { className: `text-sm font-semibold ${r.stock_critico ? 'text-accent-red' : 'text-ink'}`, children: r.stock }), _jsxs("span", { className: "text-xs text-ink-faint ml-1", children: ["/ m\u00EDn ", r.stock_minimo] })] }), _jsx("td", { className: "td", children: _jsxs("div", { className: "flex gap-1", children: [_jsx("button", { onClick: () => setAdjusting(r), className: "btn-ghost text-xs py-1 px-2", children: "Ajustar stock" }), _jsx("button", { onClick: () => { setEditing(r); setModal(true); }, className: "btn-ghost text-xs py-1 px-2", children: "Editar" })] }) })] }, r.id));
                            }) })] })) })), _jsx(RepuestoModal, { open: modal, onClose: () => setModal(false), initial: editing }), _jsx(AdjustStockModal, { open: !!adjusting, onClose: () => setAdjusting(null), repuesto: adjusting })] }));
};
