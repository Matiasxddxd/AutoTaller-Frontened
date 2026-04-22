import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { Spinner } from '../../components/ui';
export const LoginPage = () => {
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore(s => s.setAuth);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await authApi.login(data.email, data.password);
            setAuth(res.user, res.token);
            toast.success(`Bienvenido, ${res.user.email}`);
            navigate(res.user.role === 'admin' ? '/dashboard' : '/orders');
        }
        catch {
            // el interceptor de axios ya muestra el toast de error
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center p-4", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute -top-40 -left-40 w-96 h-96 bg-brand/5 rounded-full blur-3xl" }), _jsx("div", { className: "absolute -bottom-40 -right-40 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" })] }), _jsxs("div", { className: "relative w-full max-w-sm animate-slide-up", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-14 h-14 bg-brand rounded-2xl shadow-glow-blue mb-4", children: _jsx(Wrench, { size: 24, className: "text-white" }) }), _jsx("h1", { className: "text-2xl font-semibold text-ink", children: "AutoTaller" }), _jsx("p", { className: "text-sm text-ink-muted mt-1", children: "Sistema de gesti\u00F3n de taller" })] }), _jsx("div", { className: "card p-6", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Correo electr\u00F3nico" }), _jsx("input", { type: "email", placeholder: "admin@autotaller.cl", className: "input", ...register('email', { required: 'Email requerido' }) }), errors.email && (_jsx("p", { className: "text-xs text-accent-red mt-1", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Contrase\u00F1a" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPass ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "input pr-10", ...register('password', { required: 'Contraseña requerida' }) }), _jsx("button", { type: "button", onClick: () => setShowPass(!showPass), className: "absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted", children: showPass ? _jsx(EyeOff, { size: 15 }) : _jsx(Eye, { size: 15 }) })] }), errors.password && (_jsx("p", { className: "text-xs text-accent-red mt-1", children: errors.password.message }))] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full justify-center py-2.5 mt-2", children: loading ? _jsxs(_Fragment, { children: [_jsx(Spinner, { size: 15 }), " Ingresando..."] }) : 'Ingresar' })] }) }), _jsxs("p", { className: "text-center text-xs text-ink-faint mt-4", children: ["AutoTaller \u00A9 ", new Date().getFullYear()] })] })] }));
};
