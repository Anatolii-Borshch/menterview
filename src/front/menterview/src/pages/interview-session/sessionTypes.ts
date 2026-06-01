import type { KeyboardEvent } from 'react';
import type { WebSocketStatus, QuestionState, FeedbackState } from '../../types';

export interface SessionStatusColor {
  borderClass: string;
  bgClass: string;
  textClass: string;
}

export interface SessionHeaderProps {
  status: WebSocketStatus;
  onEndSession: () => void;
}

export interface SessionStateProps {
  message?: string | null;
}

export interface SessionConnectionStateProps {
  status: 'connecting' | 'error';
  onStartNewSession: () => void;
}

export interface SessionCompleteProps {
  sessionId?: string;
  onViewResults: () => void;
}

export interface SessionQuestionProps {
  question: QuestionState;
  totalQuestions?: number | null;
}

export interface SessionFeedbackProps {
  feedback: FeedbackState;
  countdown: number | null;
  pendingNextQuestion: boolean;
  onNextQuestion: () => void;
}

export interface SessionAnswerProps {
  answer: string;
  sending: boolean;
  disabled: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}
