import { useEffect, useRef } from 'react';
import { useAuthStore } from './useAuthStore';
import agent from './agent';

export const useTokenRefresh = () => {
  const { expiresAt, isAuthenticated, clearAuth } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const expiryTime = new Date(expiresAt).getTime();
    const now = Date.now();
    const refreshIn = expiryTime - now - 2 * 60 * 1000;

    if (refreshIn <= 0) {
      clearAuth();
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        await agent.auth.refresh();
      } catch {
        clearAuth();
      }
    }, refreshIn);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [expiresAt, isAuthenticated, clearAuth]);
};