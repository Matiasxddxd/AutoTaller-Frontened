import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
export const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", replace: true });
    if (roles && user && !roles.includes(user.role)) {
        return _jsx(Navigate, { to: "/orders", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
