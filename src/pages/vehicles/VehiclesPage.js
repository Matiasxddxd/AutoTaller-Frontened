import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Car, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { vehiculosApi, clientesApi } from '../../api';
import { PageHeader, EmptyState, FullPageSpinner, Modal, Spinner, SearchInput } from '../../components/ui';
const VehicleModal = ({ open, onClose }) => {
    const [clienteSearch, setClienteSearch] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const qc = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const { data: clientes = [] } = useQuery({
        queryKey: ['clients-search', clienteSearch],
        queryFn: () => clientesApi.list({ search: clienteSearch, limit: 6 }).then(r => r.data),
        enabled: clienteSearch.length > 1,
    });
    const mutation = useMutation({
        mutationFn: (data) => vehiculosApi.create(data),
        onSuccess: () => {
            toast.success('Vehículo registrado');
            qc.invalidateQueries({ queryKey: ['vehicles'] });
            reset();
            setClienteSearch('');
            setSelectedId('');
            onClose();
        },
    });
    return (_jsx(Modal, { open: open, onClose: onClose, title: "Registrar veh\u00EDculo", size: "lg", children: _jsxs("form", { onSubmit: handleSubmit(d => mutation.mutate(d)), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Cliente *" }), _jsx("input", { className: "input", placeholder: "Buscar cliente...", value: clienteSearch, onChange: e => { setClienteSearch(e.target.value); setSelectedId(''); } }), clientes.length > 0 && !selectedId && (_jsx("div", { className: "mt-1 bg-surface-3 border border-line rounded-xl overflow-hidden", children: clientes.map(c => (_jsxs("button", { type: "button", onClick: () => { setSelectedId(c.id); setValue('cliente_id', c.id); setClienteSearch(c.nombre); }, className: "w-full text-left px-3 py-2 text-sm hover:bg-surface-4 transition-colors", children: [_jsx("span", { className: "text-ink", children: c.nombre }), _jsx("span", { className: "text-ink-faint ml-2 text-xs", children: c.rut })] }, c.id))) }))] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Patente *" }), _jsx("input", { className: "input uppercase", placeholder: "ABCD12", ...register('patente', { required: 'Requerido' }) }), errors.patente && _jsx("p", { className: "text-xs text-accent-red mt-1", children: errors.patente.message })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "VIN" }), _jsx("input", { className: "input", placeholder: "17 caracteres", maxLength: 17, ...register('vin') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Marca *" }), _jsx("input", { className: "input", placeholder: "Toyota", ...register('marca', { required: true }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Modelo *" }), _jsx("input", { className: "input", placeholder: "Corolla", ...register('modelo', { required: true }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "A\u00F1o" }), _jsx("input", { type: "number", className: "input", placeholder: "2020", ...register('anio') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Color" }), _jsx("input", { className: "input", placeholder: "Blanco", ...register('color') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Combustible" }), _jsxs("select", { className: "input", ...register('combustible'), children: [_jsx("option", { value: "gasolina", children: "Gasolina" }), _jsx("option", { value: "diesel", children: "Di\u00E9sel" }), _jsx("option", { value: "electrico", children: "El\u00E9ctrico" }), _jsx("option", { value: "hibrido", children: "H\u00EDbrido" }), _jsx("option", { value: "gas", children: "Gas" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Kilometraje" }), _jsx("input", { type: "number", className: "input", placeholder: "85000", ...register('kilometraje') })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Notas" }), _jsx("textarea", { rows: 2, className: "input resize-none", ...register('notas') })] })] }), _jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-ghost", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: mutation.isPending || !selectedId, className: "btn-primary", children: mutation.isPending ? _jsxs(_Fragment, { children: [_jsx(Spinner, { size: 14 }), " Guardando..."] }) : 'Registrar' })] })] }) }));
};
export const VehiclesPage = () => {
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const { data: vehicles = [], isLoading } = useQuery({
        queryKey: ['vehicles', search],
        queryFn: () => vehiculosApi.list({ search }),
    });
    return (_jsxs("div", { className: "space-y-5", children: [_jsx(PageHeader, { title: "Veh\u00EDculos", subtitle: `${vehicles.length} registrados`, action: _jsxs("button", { onClick: () => setModal(true), className: "btn-primary", children: [_jsx(Plus, { size: 15 }), " Registrar veh\u00EDculo"] }) }), _jsx(SearchInput, { value: search, onChange: setSearch, placeholder: "Buscar por patente, marca, modelo..." }), isLoading ? _jsx(FullPageSpinner, {}) : (_jsx("div", { className: "card overflow-hidden", children: vehicles.length === 0 ? (_jsx(EmptyState, { message: "No se encontraron veh\u00EDculos", icon: Car })) : (_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-surface-2/50", children: _jsxs("tr", { children: [_jsx("th", { className: "th text-left", children: "Patente" }), _jsx("th", { className: "th text-left", children: "Veh\u00EDculo" }), _jsx("th", { className: "th text-left", children: "Cliente" }), _jsx("th", { className: "th text-left", children: "Color" }), _jsx("th", { className: "th text-right", children: "Kilometraje" }), _jsx("th", { className: "th text-left", children: "Combustible" }), _jsx("th", { className: "th" })] }) }), _jsx("tbody", { children: vehicles.map(v => (_jsxs("tr", { className: "table-row cursor-pointer", onClick: () => navigate(`/vehicles/${v.id}`), children: [_jsx("td", { className: "td font-mono font-semibold text-sm", children: v.patente }), _jsxs("td", { className: "td", children: [_jsxs("p", { className: "text-sm text-ink", children: [v.marca, " ", v.modelo] }), v.anio && _jsx("p", { className: "text-xs text-ink-faint", children: v.anio })] }), _jsx("td", { className: "td text-sm text-ink-muted", children: v.cliente_nombre }), _jsx("td", { className: "td text-sm text-ink-muted", children: v.color || '—' }), _jsx("td", { className: "td text-right text-sm text-ink-muted", children: v.kilometraje ? `${v.kilometraje.toLocaleString()} km` : '—' }), _jsx("td", { className: "td text-sm text-ink-muted capitalize", children: v.combustible }), _jsx("td", { className: "td", children: _jsx(ChevronRight, { size: 15, className: "text-ink-faint" }) })] }, v.id))) })] })) })), _jsx(VehicleModal, { open: modal, onClose: () => setModal(false) })] }));
};
