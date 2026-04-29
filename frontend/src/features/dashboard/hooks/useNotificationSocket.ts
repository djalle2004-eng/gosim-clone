import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../../auth/store/authStore';

let socket: Socket | null = null;

export const useNotificationSocket = () => {
  const { user } = useAuthStore();
  const { addNotification, incrementUnread } = useNotificationStore();
  const connected = useRef(false);

  const connect = useCallback(() => {
    if (!user?.id || connected.current) return;

    socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      connected.current = true;
      socket?.emit('join', user.id);
      console.log('[Socket] Connected and joined room:', user.id);
    });

    socket.on('notification:new', (notification: any) => {
      addNotification(notification);
      incrementUnread();
      // Optional: play a subtle sound or browser notification
    });

    socket.on('disconnect', () => {
      connected.current = false;
      console.log('[Socket] Disconnected');
    });
  }, [user?.id, addNotification, incrementUnread]);

  useEffect(() => {
    connect();
    return () => {
      socket?.disconnect();
      socket = null;
      connected.current = false;
    };
  }, [connect]);
};
