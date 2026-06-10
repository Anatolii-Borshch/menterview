export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketMessage {
  event: string;
  question_text?: string;
  question_number?: number;
  total_questions?: number;
  is_rephrased?: boolean;
  ai_reply?: string;
  accuracy?: number;
  correctness?: number;
  completeness?: number;
  message?: string;
}

export interface QuestionState {
  text: string;
  number?: number;
  total?: number;
  isRephrased: boolean;
}

export interface FeedbackState {
  aiReply: string;
  accuracy?: number;
  correctness?: number;
  completeness?: number;
}

export interface WebSocketConfig {
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
}

export interface WebSocketEvent {
  type: 'open' | 'close' | 'error' | 'message';
  data?: unknown;
  error?: Error;
}
