import type { WebSocketStatus } from '../types/websocket';


export const toWebSocketUrl = (hostOrUrl: string): string => {
  if (hostOrUrl.startsWith('ws://') || hostOrUrl.startsWith('wss://')) {
    return hostOrUrl;
  }

  if (hostOrUrl.startsWith('http://')) {
    return `ws://${hostOrUrl.slice('http://'.length)}`;
  }

  if (hostOrUrl.startsWith('https://')) {
    return `wss://${hostOrUrl.slice('https://'.length)}`;
  }

  return `ws://${hostOrUrl}`;
};

export const isWebSocketConnected = (status: WebSocketStatus): boolean => {
  return status === 'connected';
};

export const canRetryWebSocket = (status: WebSocketStatus): boolean => {
  return status === 'disconnected' || status === 'error';
};

export const getWebSocketStatusText = (status: WebSocketStatus): string => {
  const statusMap: Record<WebSocketStatus, string> = {
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
    error: 'Connection Error',
  };
  return statusMap[status];
};

export const calculateBackoffDelay = (
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): number => {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  const jitter = Math.random() * 100;
  return delay + jitter;
};
