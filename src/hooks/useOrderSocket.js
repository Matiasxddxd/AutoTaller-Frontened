import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
let socket = null;
const getSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000', {
            withCredentials: true,
        });
    }
    return socket;
};
export const useOrderSocket = (orderId) => {
    const queryClient = useQueryClient();
    useEffect(() => {
        if (!orderId)
            return;
        const s = getSocket();
        s.emit('join:order', orderId);
        s.on('order:status_updated', ({ orderId: id, estadoNuevo }) => {
            // Invalidar cache para refrescar la orden
            queryClient.invalidateQueries({ queryKey: ['orders', id] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        });
        return () => { s.off('order:status_updated'); };
    }, [orderId, queryClient]);
};
