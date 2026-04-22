import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ORDER_STATUS, QUOTE_STATUS } from '../../lib/utils';
// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 20 }) => (_jsx(Loader2, { size: size, className: "animate-spin text-brand" }));
export const FullPageSpinner = () => (_jsx("div", { className: "flex-1 flex items-center justify-center min-h-[60vh]", children: _jsx(Spinner, { size: 28 }) }));
const MODAL_SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: cn('relative w-full card p-6 animate-slide-up', MODAL_SIZES[size]), children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "text-base font-semibold text-ink", children: title }), _jsx("button", { onClick: onClose, className: "btn-ghost p-1.5 rounded-lg", children: _jsx(X, { size: 16 }) })] }), children] })] }));
};
export const PageHeader = ({ title, subtitle, action }) => (_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-ink", children: title }), subtitle && _jsx("p", { className: "text-sm text-ink-muted mt-0.5", children: subtitle })] }), action && _jsx("div", { children: action })] }));
// ── Empty state ───────────────────────────────────────────────────────────────
export const EmptyState = ({ message, icon: Icon }) => (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [Icon && _jsx(Icon, { size: 36, className: "text-ink-faint mb-3" }), _jsx("p", { className: "text-ink-muted text-sm", children: message })] }));
// ── Status badge ──────────────────────────────────────────────────────────────
export const OrderBadge = ({ status }) => {
    const cfg = ORDER_STATUS[status];
    return _jsxs("span", { className: cfg.badge, children: [_jsx("span", { className: cn('w-1.5 h-1.5 rounded-full', cfg.dot) }), cfg.label] });
};
export const QuoteBadge = ({ status }) => {
    const cfg = QUOTE_STATUS[status];
    return _jsx("span", { className: cfg.badge, children: cfg.label });
};
export const StatCard = ({ label, value, sub, color = 'text-ink' }) => (_jsxs("div", { className: "card p-5", children: [_jsx("p", { className: "text-xs text-ink-faint uppercase tracking-wider mb-1", children: label }), _jsx("p", { className: cn('text-2xl font-semibold', color), children: value }), sub && _jsx("p", { className: "text-xs text-ink-muted mt-1", children: sub })] }));
export const SearchInput = ({ value, onChange, placeholder = 'Buscar...' }) => (_jsx("input", { type: "text", value: value, onChange: e => onChange(e.target.value), placeholder: placeholder, className: "input max-w-xs" }));
export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, loading }) => (_jsxs(Modal, { open: open, onClose: onClose, title: title, size: "sm", children: [_jsxs("div", { className: "flex items-start gap-3 mb-5", children: [_jsx(AlertCircle, { size: 18, className: "text-accent-amber shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-ink-muted", children: message })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { onClick: onClose, className: "btn-ghost", children: "Cancelar" }), _jsx("button", { onClick: onConfirm, disabled: loading, className: "btn-primary", children: loading ? _jsx(Spinner, { size: 14 }) : 'Confirmar' })] })] }));
