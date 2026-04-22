import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal, Spinner } from '../../components/ui';
import { ordenesApi, vehiculosApi, clientesApi } from '../../api';
export const NewOrderModal = ({ open, onClose }) => {
    const [clienteSearch, setClienteSearch] = useState('');
    const [selectedClienteId, setSelectedClienteId] = useState('');
    const qc = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { data: clientes = [] } = useQuery({
        queryKey: ['clients-search', clienteSearch],
        queryFn: () => clientesApi.list({ search: clienteSearch, limit: 8 }).then(r => r.data),
        enabled: clienteSearch.length > 1,
    });
    const { data: vehiculos = [] } = useQuery({
        queryKey: ['vehicles-by-client', selectedClienteId],
        queryFn: () => vehiculosApi.list({ cliente_id: selectedClienteId }),
        enabled: !!selectedClienteId,
    });
    const mutation = useMutation({
        mutationFn: (data) => ordenesApi.create(data),
        onSuccess: () => {
            toast.success('Orden creada correctamente');
            qc.invalidateQueries({ queryKey: ['orders'] });
            reset();
            setClienteSearch('');
            setSelectedClienteId('');
            onClose();
        },
    });
    return (_jsx(Modal, { open: open, onClose: onClose, title: "Nueva orden de trabajo", size: "lg", children: _jsxs("form", { onSubmit: handleSubmit(d => mutation.mutate(d)), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Buscar cliente" }), _jsx("input", { className: "input", placeholder: "Nombre, RUT o email...", value: clienteSearch, onChange: e => setClienteSearch(e.target.value) }), clientes.length > 0 && !selectedClienteId && (_jsx("div", { className: "mt-1 bg-surface-3 border border-line rounded-xl overflow-hidden", children: clientes.map(c => (_jsxs("button", { type: "button", onClick: () => { setSelectedClienteId(c.id); setClienteSearch(c.nombre); }, className: "w-full text-left px-3 py-2 text-sm hover:bg-surface-4 transition-colors", children: [_jsx("span", { className: "text-ink", children: c.nombre }), _jsx("span", { className: "text-ink-faint ml-2 text-xs", children: c.telefono })] }, c.id))) }))] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Veh\u00EDculo" }), _jsxs("select", { className: "input", disabled: !selectedClienteId, ...register('vehiculo_id', { required: true }), children: [_jsx("option", { value: "", children: "Seleccionar veh\u00EDculo..." }), vehiculos.map(v => (_jsxs("option", { value: v.id, children: [v.patente, " \u2014 ", v.marca, " ", v.modelo, " ", v.anio] }, v.id)))] }), errors.vehiculo_id && _jsx("p", { className: "text-xs text-accent-red mt-1", children: "Veh\u00EDculo requerido" })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Prioridad" }), _jsxs("select", { className: "input", ...register('prioridad'), children: [_jsx("option", { value: "normal", children: "Normal" }), _jsx("option", { value: "baja", children: "Baja" }), _jsx("option", { value: "alta", children: "Alta" }), _jsx("option", { value: "urgente", children: "Urgente" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Kilometraje ingreso" }), _jsx("input", { type: "number", className: "input", placeholder: "85000", ...register('kilometraje_ingreso') })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Fecha estimada entrega" }), _jsx("input", { type: "date", className: "input", ...register('fecha_estimada') })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Diagn\u00F3stico inicial" }), _jsx("textarea", { rows: 3, className: "input resize-none", placeholder: "Descripci\u00F3n del problema...", ...register('diagnostico') })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "label", children: "Notas internas" }), _jsx("textarea", { rows: 2, className: "input resize-none", placeholder: "Solo visible para el equipo...", ...register('notas_internas') })] })] }), _jsxs("div", { className: "flex gap-2 justify-end pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-ghost", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: mutation.isPending, className: "btn-primary", children: mutation.isPending ? _jsxs(_Fragment, { children: [_jsx(Spinner, { size: 14 }), " Creando..."] }) : 'Crear orden' })] })] }) }));
};
