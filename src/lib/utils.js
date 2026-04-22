export const formatMoney = (n) => `$${Math.round(n).toLocaleString('es-CL')}`;
export const formatDate = (d) => new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
export const formatDateTime = (d) => new Date(d).toLocaleString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
});
// ── Estados de Orden ──────────────────────────────────────────────────────────
export const ORDER_STATUS = {
    pendiente: { label: 'Pendiente', badge: 'badge-pending', dot: 'bg-accent-amber' },
    en_proceso: { label: 'En proceso', badge: 'badge-progress', dot: 'bg-brand-glow' },
    terminado: { label: 'Terminado', badge: 'badge-done', dot: 'bg-accent-green' },
    entregado: { label: 'Entregado', badge: 'badge-delivered', dot: 'bg-ink-faint' },
};
export const NEXT_STATUS = {
    pendiente: 'en_proceso',
    en_proceso: 'terminado',
    terminado: 'entregado',
    entregado: null,
};
export const NEXT_STATUS_LABEL = {
    pendiente: 'Iniciar trabajo',
    en_proceso: 'Marcar terminado',
    terminado: 'Registrar entrega',
    entregado: '',
};
// ── Estados de Cotización ─────────────────────────────────────────────────────
export const QUOTE_STATUS = {
    borrador: { label: 'Borrador', badge: 'badge-draft' },
    enviada: { label: 'Enviada', badge: 'badge-progress' },
    aprobada: { label: 'Aprobada', badge: 'badge-approved' },
    rechazada: { label: 'Rechazada', badge: 'badge-rejected' },
    vencida: { label: 'Vencida', badge: 'badge-delivered' },
};
// ── Prioridad ─────────────────────────────────────────────────────────────────
export const PRIORITY = {
    baja: { label: 'Baja', color: 'text-ink-faint' },
    normal: { label: 'Normal', color: 'text-ink-muted' },
    alta: { label: 'Alta', color: 'text-accent-amber' },
    urgente: { label: 'Urgente', color: 'text-accent-red' },
};
export const cn = (...classes) => classes.filter(Boolean).join(' ');
