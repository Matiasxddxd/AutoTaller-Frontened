import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Phone, Mail, Car } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { clientesApi } from '../../api';
import { PageHeader, EmptyState, FullPageSpinner, Modal, Spinner, SearchInput, } from '../../components/ui';
import { formatDate } from '../../lib/utils';
const ClientModal = ({ open, onClose, initial }) => {
    const qc = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: initial,
    });
    const mutation = useMutation({
        mutationFn: (data) => initial ? clientesApi.update(initial.id, data) : clientesApi.create(data),
        onSuccess: () => {
            toast.success(initial ? 'Cliente actualizado' : 'Cliente creado');
            qc.invalidateQueries({ queryKey: ['clients'] });
            reset();
            onClose();
        },
    });
    return (_jsx(Modal, { open: open, onClose: onClose, title: initial ? 'Editar cliente' : 'Nuevo cliente', size: "md", children: _jsxs("form", { onSubmit: handleSubmit(d => mutation.mutate(d)), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Nombre completo *" }), _jsx("input", { className: "input", placeholder: "Juan P\u00E9rez", ...register('nombre', { required: 'Requerido' }) }), errors.nombre && _jsx("p", { className: "text-xs text-accent-red mt-1", children: errors.nombre.message })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Tel\u00E9fono" }), _jsx("input", { className: "input", placeholder: "+56912345678", ...register('telefono') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "RUT" }), _jsx("input", { className: "input", placeholder: "12.345.678-9", ...register('rut') })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Email" }), _jsx("input", { type: "email", className: "input", placeholder: "juan@email.cl", ...register('email') })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Direcci\u00F3n" }), _jsx("input", { className: "input", placeholder: "Av. Principal 1234", ...register('direccion') })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Notas" }), _jsx("textarea", { rows: 2, className: "input resize-none", ...register('notas') })] })] }), _jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-ghost", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: mutation.isPending, className: "btn-primary", children: mutation.isPending ? _jsxs(_Fragment, { children: [_jsx(Spinner, { size: 14 }), " Guardando..."] }) : 'Guardar' })] })] }) }));
};
export const ClientsPage = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState();
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ['clients', search, page],
        queryFn: () => clientesApi.list({ search, page, limit: 20 }),
    });
    const clients = data?.data ?? [];
    const total = data?.total ?? 0;
    return (_jsxs("div", { className: "space-y-5", children: [_jsx(PageHeader, { title: "Clientes", subtitle: `${total} registrados`, action: _jsxs("button", { onClick: () => { setEditing(undefined); setModal(true); }, className: "btn-primary", children: [_jsx(Plus, { size: 15 }), " Nuevo cliente"] }) }), _jsx("div", { className: "flex items-center gap-3", children: _jsx(SearchInput, { value: search, onChange: v => { setSearch(v); setPage(1); }, placeholder: "Buscar por nombre, RUT, email..." }) }), isLoading ? _jsx(FullPageSpinner, {}) : (_jsx("div", { className: "card overflow-hidden", children: clients.length === 0 ? (_jsx(EmptyState, { message: "No se encontraron clientes", icon: Users })) : (_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-surface-2/50", children: _jsxs("tr", { children: [_jsx("th", { className: "th text-left", children: "Cliente" }), _jsx("th", { className: "th text-left", children: "Contacto" }), _jsx("th", { className: "th text-left", children: "RUT" }), _jsx("th", { className: "th text-center", children: "Veh\u00EDculos" }), _jsx("th", { className: "th text-center", children: "\u00D3rdenes" }), _jsx("th", { className: "th text-left", children: "Desde" }), _jsx("th", { className: "th" })] }) }), _jsx("tbody", { children: clients.map(c => (_jsxs("tr", { className: "table-row cursor-pointer", onClick: () => navigate(`/clients/${c.id}`), children: [_jsxs("td", { className: "td", children: [_jsx("p", { className: "font-medium text-ink", children: c.nombre }), c.direccion && _jsx("p", { className: "text-xs text-ink-faint", children: c.direccion })] }), _jsxs("td", { className: "td", children: [c.telefono && (_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-ink-muted", children: [_jsx(Phone, { size: 11 }), c.telefono] })), c.email && (_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-ink-muted mt-0.5", children: [_jsx(Mail, { size: 11 }), c.email] }))] }), _jsx("td", { className: "td font-mono text-xs text-ink-muted", children: c.rut || '—' }), _jsx("td", { className: "td text-center", children: _jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-ink-muted", children: [_jsx(Car, { size: 12 }), c.total_vehiculos ?? 0] }) }), _jsx("td", { className: "td text-center text-xs text-ink-muted", children: c.total_ordenes ?? 0 }), _jsx("td", { className: "td text-xs text-ink-faint", children: formatDate(c.created_at) }), _jsx("td", { className: "td", children: _jsx("button", { onClick: e => { e.stopPropagation(); setEditing(c); setModal(true); }, className: "btn-ghost py-1 px-2 text-xs", children: "Editar" }) })] }, c.id))) })] })) })), total > 20 && (_jsxs("div", { className: "flex justify-center gap-2", children: [_jsx("button", { onClick: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1, className: "btn-ghost", children: "Anterior" }), _jsxs("span", { className: "text-sm text-ink-muted flex items-center", children: ["P\u00E1gina ", page, " de ", Math.ceil(total / 20)] }), _jsx("button", { onClick: () => setPage(p => p + 1), disabled: page * 20 >= total, className: "btn-ghost", children: "Siguiente" })] })), _jsx(ClientModal, { open: modal, onClose: () => setModal(false), initial: editing })] }));
};
