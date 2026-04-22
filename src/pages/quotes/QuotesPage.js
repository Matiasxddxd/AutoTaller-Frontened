import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText, Download, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { cotizacionesApi, clientesApi, vehiculosApi } from '../../api';
import { PageHeader, EmptyState, FullPageSpinner, Modal, Spinner, QuoteBadge, SearchInput, } from '../../components/ui';
import { formatDate, formatMoney } from '../../lib/utils';
const IVA = 0.19;
const NewQuoteModal = ({ open, onClose }) => {
    const [clienteSearch, setClienteSearch] = useState('');
    const [selectedClienteId, setSelectedClienteId] = useState('');
    const qc = useQueryClient();
    const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } = useForm({
        defaultValues: { items: [{ tipo: 'mano_de_obra', descripcion: '', cantidad: 1, precio_unitario: 0 }] },
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'items' });
    const items = watch('items');
    const subtotal = items.reduce((s, i) => s + (Number(i.cantidad) * Number(i.precio_unitario)), 0);
    const iva = subtotal * IVA;
    const total = subtotal + iva;
    const { data: clientes = [] } = useQuery({
        queryKey: ['clients-search', clienteSearch],
        queryFn: () => clientesApi.list({ search: clienteSearch, limit: 6 }).then(r => r.data),
        enabled: clienteSearch.length > 1,
    });
    const { data: vehiculos = [] } = useQuery({
        queryKey: ['vehicles-by-client', selectedClienteId],
        queryFn: () => vehiculosApi.list({ cliente_id: selectedClienteId }),
        enabled: !!selectedClienteId,
    });
    const mutation = useMutation({
        mutationFn: (data) => cotizacionesApi.create(data),
        onSuccess: () => {
            toast.success('Cotización creada');
            qc.invalidateQueries({ queryKey: ['quotes'] });
            reset();
            setClienteSearch('');
            setSelectedClienteId('');
            onClose();
        },
    });
    return (_jsx(Modal, { open: open, onClose: onClose, title: "Nueva cotizaci\u00F3n", size: "xl", children: _jsxs("form", { onSubmit: handleSubmit(d => mutation.mutate(d)), className: "space-y-5", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Cliente *" }), _jsx("input", { className: "input", placeholder: "Buscar cliente...", value: clienteSearch, onChange: e => { setClienteSearch(e.target.value); setSelectedClienteId(''); } }), clientes.length > 0 && !selectedClienteId && (_jsx("div", { className: "mt-1 bg-surface-3 border border-line rounded-xl overflow-hidden", children: clientes.map(c => (_jsxs("button", { type: "button", onClick: () => { setSelectedClienteId(c.id); setValue('cliente_id', c.id); setClienteSearch(c.nombre); }, className: "w-full text-left px-3 py-2 text-sm hover:bg-surface-4 transition-colors", children: [c.nombre, " ", _jsx("span", { className: "text-ink-faint text-xs ml-2", children: c.rut })] }, c.id))) }))] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Veh\u00EDculo *" }), _jsxs("select", { className: "input", disabled: !selectedClienteId, ...register('vehiculo_id', { required: true }), children: [_jsx("option", { value: "", children: "Seleccionar..." }), vehiculos.map(v => (_jsxs("option", { value: v.id, children: [v.patente, " \u2014 ", v.marca, " ", v.modelo] }, v.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "V\u00E1lida hasta" }), _jsx("input", { type: "date", className: "input", ...register('vencimiento') })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { className: "label mb-0", children: "\u00CDtems" }), _jsxs("button", { type: "button", onClick: () => append({ tipo: 'repuesto', descripcion: '', cantidad: 1, precio_unitario: 0 }), className: "btn-ghost text-xs", children: [_jsx(Plus, { size: 12 }), " Agregar \u00EDtem"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "grid grid-cols-12 gap-2 px-2 text-xs text-ink-faint", children: [_jsx("span", { className: "col-span-1", children: "Tipo" }), _jsx("span", { className: "col-span-5", children: "Descripci\u00F3n" }), _jsx("span", { className: "col-span-2 text-right", children: "Cant." }), _jsx("span", { className: "col-span-2 text-right", children: "Precio unit." }), _jsx("span", { className: "col-span-1 text-right", children: "Total" }), _jsx("span", { className: "col-span-1" })] }), fields.map((field, i) => {
                                    const rowTotal = Number(items[i]?.cantidad ?? 0) * Number(items[i]?.precio_unitario ?? 0);
                                    return (_jsxs("div", { className: "grid grid-cols-12 gap-2 items-center bg-surface-2 rounded-xl px-2 py-2", children: [_jsx("div", { className: "col-span-1", children: _jsxs("select", { className: "input py-1.5 text-xs", ...register(`items.${i}.tipo`), children: [_jsx("option", { value: "mano_de_obra", children: "M.O." }), _jsx("option", { value: "repuesto", children: "Rep." }), _jsx("option", { value: "otro", children: "Otro" })] }) }), _jsx("div", { className: "col-span-5", children: _jsx("input", { className: "input py-1.5 text-xs", placeholder: "Descripci\u00F3n...", ...register(`items.${i}.descripcion`, { required: true }) }) }), _jsx("div", { className: "col-span-2", children: _jsx("input", { type: "number", min: "0.01", step: "0.01", className: "input py-1.5 text-xs text-right", ...register(`items.${i}.cantidad`) }) }), _jsx("div", { className: "col-span-2", children: _jsx("input", { type: "number", min: "0", step: "1", className: "input py-1.5 text-xs text-right", ...register(`items.${i}.precio_unitario`) }) }), _jsx("div", { className: "col-span-1 text-right text-xs font-medium text-ink", children: formatMoney(rowTotal) }), _jsx("div", { className: "col-span-1 flex justify-end", children: fields.length > 1 && (_jsx("button", { type: "button", onClick: () => remove(i), className: "text-ink-faint hover:text-accent-red p-1", children: _jsx(Trash2, { size: 13 }) })) })] }, field.id));
                                })] }), _jsx("div", { className: "flex justify-end mt-3", children: _jsxs("div", { className: "bg-surface-2 rounded-xl p-4 min-w-48 space-y-1.5 text-sm", children: [_jsxs("div", { className: "flex justify-between text-ink-muted", children: [_jsx("span", { children: "Subtotal" }), _jsx("span", { children: formatMoney(subtotal) })] }), _jsxs("div", { className: "flex justify-between text-ink-muted", children: [_jsx("span", { children: "IVA (19%)" }), _jsx("span", { children: formatMoney(iva) })] }), _jsxs("div", { className: "flex justify-between font-semibold text-ink border-t border-line pt-1.5 mt-1", children: [_jsx("span", { children: "Total" }), _jsx("span", { className: "text-accent-green", children: formatMoney(total) })] })] }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Notas" }), _jsx("textarea", { rows: 2, className: "input resize-none", placeholder: "Observaciones para el cliente...", ...register('notas') })] }), _jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-ghost", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: mutation.isPending || !selectedClienteId, className: "btn-primary", children: mutation.isPending ? _jsxs(_Fragment, { children: [_jsx(Spinner, { size: 14 }), " Creando..."] }) : 'Crear cotización' })] })] }) }));
};
const FILTER_TABS = [
    { label: 'Todas', value: 'all' },
    { label: 'Borrador', value: 'borrador' },
    { label: 'Enviadas', value: 'enviada' },
    { label: 'Aprobadas', value: 'aprobada' },
    { label: 'Rechazadas', value: 'rechazada' },
];
export const QuotesPage = () => {
    const [filter, setFilter] = useState('all');
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState('');
    const qc = useQueryClient();
    const { data: quotes = [], isLoading } = useQuery({
        queryKey: ['quotes', filter],
        queryFn: () => cotizacionesApi.list(filter !== 'all' ? { estado: filter } : undefined),
    });
    const statusMutation = useMutation({
        mutationFn: ({ id, estado }) => cotizacionesApi.updateStatus(id, estado),
        onSuccess: () => {
            toast.success('Cotización actualizada');
            qc.invalidateQueries({ queryKey: ['quotes'] });
        },
    });
    const filtered = quotes.filter(q => !search ||
        q.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
        q.patente?.toLowerCase().includes(search.toLowerCase()));
    return (_jsxs("div", { className: "space-y-5", children: [_jsx(PageHeader, { title: "Cotizaciones", subtitle: `${filtered.length} cotizaciones`, action: _jsxs("button", { onClick: () => setModal(true), className: "btn-primary", children: [_jsx(Plus, { size: 15 }), " Nueva cotizaci\u00F3n"] }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("div", { className: "flex bg-surface-2 rounded-xl p-1 gap-0.5", children: FILTER_TABS.map(tab => (_jsx("button", { onClick: () => setFilter(tab.value), className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === tab.value ? 'bg-surface-4 text-ink' : 'text-ink-muted hover:text-ink'}`, children: tab.label }, tab.value))) }), _jsx(SearchInput, { value: search, onChange: setSearch, placeholder: "Buscar cliente, patente..." })] }), isLoading ? _jsx(FullPageSpinner, {}) : (_jsx("div", { className: "card overflow-hidden", children: filtered.length === 0 ? (_jsx(EmptyState, { message: "No hay cotizaciones", icon: FileText })) : (_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-surface-2/50", children: _jsxs("tr", { children: [_jsx("th", { className: "th text-left", children: "ID" }), _jsx("th", { className: "th text-left", children: "Cliente" }), _jsx("th", { className: "th text-left", children: "Veh\u00EDculo" }), _jsx("th", { className: "th text-right", children: "Total" }), _jsx("th", { className: "th text-left", children: "Estado" }), _jsx("th", { className: "th text-left", children: "Fecha" }), _jsx("th", { className: "th text-center", children: "Acciones" })] }) }), _jsx("tbody", { children: filtered.map(q => (_jsxs("tr", { className: "table-row", children: [_jsxs("td", { className: "td font-mono text-xs text-ink-faint", children: ["#", q.id.slice(0, 8)] }), _jsx("td", { className: "td text-sm", children: q.cliente_nombre }), _jsxs("td", { className: "td", children: [_jsx("p", { className: "text-sm font-mono font-semibold", children: q.patente }), _jsxs("p", { className: "text-xs text-ink-faint", children: [q.marca, " ", q.modelo] })] }), _jsx("td", { className: "td text-right font-semibold text-sm", children: formatMoney(q.total) }), _jsx("td", { className: "td", children: _jsx(QuoteBadge, { status: q.estado }) }), _jsx("td", { className: "td text-xs text-ink-faint", children: formatDate(q.created_at) }), _jsx("td", { className: "td", children: _jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx("button", { onClick: () => cotizacionesApi.downloadPdf(q.id, `cotizacion-${q.id.slice(0, 8)}.pdf`), className: "btn-ghost p-1.5", title: "Descargar PDF", children: _jsx(Download, { size: 13 }) }), (q.estado === 'enviada' || q.estado === 'borrador') && (_jsx("button", { onClick: () => statusMutation.mutate({ id: q.id, estado: 'aprobada' }), className: "btn-ghost p-1.5 text-accent-green hover:bg-accent-green/10", title: "Aprobar", children: _jsx(CheckCircle, { size: 13 }) })), (q.estado === 'enviada' || q.estado === 'borrador') && (_jsx("button", { onClick: () => statusMutation.mutate({ id: q.id, estado: 'rechazada' }), className: "btn-ghost p-1.5 text-accent-red hover:bg-accent-red/10", title: "Rechazar", children: _jsx(XCircle, { size: 13 }) }))] }) })] }, q.id))) })] })) })), _jsx(NewQuoteModal, { open: modal, onClose: () => setModal(false) })] }));
};
