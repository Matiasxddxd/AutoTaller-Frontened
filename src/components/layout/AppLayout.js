import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
export const AppLayout = () => (_jsxs("div", { className: "flex h-screen overflow-hidden", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 overflow-y-auto", children: _jsx("div", { className: "p-6 max-w-7xl mx-auto animate-fade-in", children: _jsx(Outlet, {}) }) })] }));
