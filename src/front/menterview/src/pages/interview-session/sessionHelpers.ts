import type { WebSocketStatus } from '../../types';
import type { SessionStatusColor } from './sessionTypes';
import { SESSION_CONSTANTS, SESSION_STATUS } from './sessionConstants';

export const toWsBaseUrl = (host: string): string => {
  if (host.startsWith('ws://') || host.startsWith('wss://')) return host;
  if (host.startsWith('http://')) return `ws://${host.slice('http://'.length)}`;
  if (host.startsWith('https://')) return `wss://${host.slice('https://'.length)}`;
  return `ws://${host}`;
};

export const getSessionStatusColor = (status: WebSocketStatus): SessionStatusColor => {
  switch (status) {
    case SESSION_STATUS.CONNECTED:
      return {
        borderClass: 'border-green-100',
        bgClass: 'bg-green-50',
        textClass: 'text-green-600',
      };
    case SESSION_STATUS.CONNECTING:
      return {
        borderClass: 'border-yellow-100',
        bgClass: 'bg-yellow-50',
        textClass: 'text-yellow-600',
      };
    case SESSION_STATUS.ERROR:
    case SESSION_STATUS.DISCONNECTED:
    default:
      return {
        borderClass: 'border-red-100',
        bgClass: 'bg-red-50',
        textClass: 'text-red-500',
      };
  }
};

export const getReconnectDelay = (attempt: number): number => {
  return SESSION_CONSTANTS.WS_CONFIG.RECONNECT_DELAY_BASE * (attempt + 1);
};
