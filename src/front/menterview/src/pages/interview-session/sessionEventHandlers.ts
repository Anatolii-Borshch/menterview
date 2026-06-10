import type { Dispatch, SetStateAction } from 'react';
import type { FeedbackState, QuestionState, WebSocketMessage, WebSocketStatus } from '../../types';
import { SESSION_CONSTANTS, SESSION_TEXT, SESSION_STATUS } from './sessionConstants';

export type MutableRef<T> = { current: T };

interface HandleSessionMessageArgs {
  message: WebSocketMessage;
  sessionTotalQuestions: number | null;
  awaitingAdvanceRef: MutableRef<boolean>;
  feedbackRef: MutableRef<FeedbackState | null>;
  pendingFinishRef: MutableRef<boolean>;
  fallbackQuestionNumberRef: MutableRef<number>;
  setPendingQuestion: Dispatch<SetStateAction<QuestionState | null>>;
  setCurrentQuestion: Dispatch<SetStateAction<QuestionState | null>>;
  setAnswer: Dispatch<SetStateAction<string>>;
  setSessionTotalQuestions: Dispatch<SetStateAction<number | null>>;
  setFeedback: Dispatch<SetStateAction<FeedbackState | null>>;
  setAwaitingAdvance: Dispatch<SetStateAction<boolean>>;
  startAdvanceCountdown: () => void;
  clearCountdown: () => void;
  setFinished: Dispatch<SetStateAction<boolean>>;
}

interface HandleSessionCloseArgs {
  code: number;
  reason: string;
  finishedRef: MutableRef<boolean>;
  reconnectAttemptsRef: MutableRef<number>;
  urlIndexRef: MutableRef<number>;
  urls: string[];
  maxAttempts: number;
  setWsStatus: Dispatch<SetStateAction<WebSocketStatus>>;
  setSessionMessage: Dispatch<SetStateAction<string | null>>;
  retry: () => void;
}

const processQuestionMessage = ({
  message,
  sessionTotalQuestions,
  awaitingAdvanceRef,
  fallbackQuestionNumberRef,
  setPendingQuestion,
  setCurrentQuestion,
  setAnswer,
}: Pick<HandleSessionMessageArgs, 'message' | 'sessionTotalQuestions' | 'awaitingAdvanceRef' | 'fallbackQuestionNumberRef' | 'setPendingQuestion' | 'setCurrentQuestion' | 'setAnswer'>): void => {
  if (!message.question_text) return;

  const questionNumber =
    typeof message.question_number === 'number' ? message.question_number : fallbackQuestionNumberRef.current + 1;
  fallbackQuestionNumberRef.current = questionNumber;

  const incoming: QuestionState = {
    text: message.question_text,
    number: questionNumber,
    total: typeof message.total_questions === 'number' ? message.total_questions : sessionTotalQuestions ?? undefined,
    isRephrased: !!message.is_rephrased,
  };

  if (awaitingAdvanceRef.current) {
    setPendingQuestion(incoming);
  } else {
    setCurrentQuestion(incoming);
    setAnswer('');
  }
};

const processFinishMessage = ({
  awaitingAdvanceRef,
  feedbackRef,
  pendingFinishRef,
  clearCountdown,
  setFinished,
}: Pick<HandleSessionMessageArgs, 'awaitingAdvanceRef' | 'feedbackRef' | 'pendingFinishRef' | 'clearCountdown' | 'setFinished'>): void => {
  if (awaitingAdvanceRef.current || feedbackRef.current !== null) {
    pendingFinishRef.current = true;
    return;
  }

  clearCountdown();
  setFinished(true);
};

const processSessionStartedMessage = ({
  message,
  setSessionTotalQuestions,
}: Pick<HandleSessionMessageArgs, 'message' | 'setSessionTotalQuestions'>): void => {
  if (typeof message.total_questions === 'number') {
    setSessionTotalQuestions(message.total_questions);
  }
};

const processAnswerFeedbackMessage = ({
  message,
  setFeedback,
  setAwaitingAdvance,
  startAdvanceCountdown,
}: Pick<HandleSessionMessageArgs, 'message' | 'setFeedback' | 'setAwaitingAdvance' | 'startAdvanceCountdown'>): void => {
  setFeedback({
    aiReply: message.ai_reply ?? SESSION_TEXT.NO_FEEDBACK,
    accuracy: message.accuracy,
    correctness: message.correctness,
    completeness: message.completeness,
  });
  setAwaitingAdvance(true);
  startAdvanceCountdown();
};

const processQuestionTimeoutMessage = ({
  message,
  setFeedback,
  setAwaitingAdvance,
  startAdvanceCountdown,
}: Pick<HandleSessionMessageArgs, 'message' | 'setFeedback' | 'setAwaitingAdvance' | 'startAdvanceCountdown'>): void => {
  setFeedback({ aiReply: message.message ?? SESSION_TEXT.TIMEOUT });
  setAwaitingAdvance(true);
  startAdvanceCountdown();
};

export const handleSessionSocketMessage = (args: HandleSessionMessageArgs): void => {
  switch (args.message.event) {
    case SESSION_CONSTANTS.WS_EVENTS.QUESTION:
      processQuestionMessage(args);
      return;
    case SESSION_CONSTANTS.WS_EVENTS.SESSION_FINISHED:
      processFinishMessage(args);
      return;
    case SESSION_CONSTANTS.WS_EVENTS.SESSION_STARTED:
      processSessionStartedMessage(args);
      return;
    case SESSION_CONSTANTS.WS_EVENTS.ANSWER_FEEDBACK:
      processAnswerFeedbackMessage(args);
      return;
    case SESSION_CONSTANTS.WS_EVENTS.QUESTION_TIMEOUT:
      processQuestionTimeoutMessage(args);
      return;
    default:
      return;
  }
};

export const handleSessionSocketClose = ({
  code,
  reason,
  finishedRef,
  reconnectAttemptsRef,
  urlIndexRef,
  urls,
  maxAttempts,
  setWsStatus,
  setSessionMessage,
  retry,
}: HandleSessionCloseArgs): void => {
  if (finishedRef.current) {
    setWsStatus(SESSION_STATUS.DISCONNECTED);
    return;
  }

  if (code === SESSION_CONSTANTS.WS_CLOSE_CODES.UNAUTHORIZED) {
    setWsStatus(SESSION_STATUS.ERROR);
    setSessionMessage(reason || SESSION_TEXT.SESSION_FAILED);
    return;
  }

  if (reconnectAttemptsRef.current < maxAttempts) {
    setWsStatus(SESSION_STATUS.CONNECTING);

    if (urlIndexRef.current < urls.length - 1) {
      urlIndexRef.current += 1;
    }

    reconnectAttemptsRef.current += 1;
    retry();
    return;
  }

  setWsStatus(SESSION_STATUS.ERROR);
  const suffix = reason ? ` (${reason})` : '';
  setSessionMessage(`Interview session disconnected [${code}]${suffix}.`);
};
