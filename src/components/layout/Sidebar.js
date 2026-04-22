import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Car, FileText, ClipboardList, Package, LogOut, Wrench, ChevronRight, } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
const NAV = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin'] },
    { to: '/orders', icon: ClipboardList, label: 'Órdenes', roles: ['admin', 'mecanico'] },
    { to: '/quotes', icon: FileText, label: 'Cotizaciones', roles: ['admin', 'mecanico'] },
    { to: '/clients', icon: Users, label: 'Clientes', roles: ['admin', 'mecanico'] },
    { to: '/vehicles', icon: Car, label: 'Vehículos', roles: ['admin', 'mecanico'] },
    { to: '/repuestos', icon: Package, label: 'Repuestos', roles: ['admin'] },
];
export const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };
    const links = NAV.filter(n => n.roles.includes(user?.role || ''));
    return (_jsxs("aside", { className: "w-60 shrink-0 bg-surface-1 border-r border-line flex flex-col h-screen sticky top-0", children: [_jsx("div", { className: "px-5 py-5 border-b border-line", children: _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-glow-blue", children: _jsx(Wrench, { size: 16, className: "text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-ink leading-none", children: "AutoTaller" }), _jsx("p", { className: "text-xs text-ink-faint mt-0.5", children: "Sistema de gesti\u00F3n" })] })] }) }), _jsx("nav", { className: "flex-1 overflow-y-auto px-3 py-4 space-y-0.5", children: links.map(({ to, icon: Icon, label }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => `nav-link group ${isActive ? 'active' : ''}`, children: [_jsx(Icon, { size: 17, className: "shrink-0" }), _jsx("span", { className: "flex-1", children: label }), _jsx(ChevronRight, { size: 13, className: "opacity-0 group-hover:opacity-40 transition-opacity" })] }, to))) }), _jsxs("div", { className: "px-3 py-4 border-t border-line space-y-0.5", children: [_jsxs("div", { className: "px-3 py-2 mb-1", children: [_jsx("p", { className: "text-xs text-ink-faint", children: "Sesi\u00F3n activa" }), _jsx("p", { className: "text-sm text-ink font-medium truncate", children: user?.email }), _jsx("span", { className: "text-xs text-brand-glow capitalize", children: user?.role })] }), _jsxs("button", { onClick: handleLogout, className: "nav-link w-full text-accent-red hover:text-accent-red hover:bg-accent-red/10", children: [_jsx(LogOut, { size: 17 }), "Cerrar sesi\u00F3n"] })] })] }));
};
