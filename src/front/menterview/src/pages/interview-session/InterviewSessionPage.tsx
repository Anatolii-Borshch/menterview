import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { SessionStartedDto } from '../../api/models/sessionModels';
import { COLORS, ROUTES } from '../../constants';
import type { FeedbackState, QuestionState, WebSocketMessage, WebSocketStatus } from '../../types';
import { SessionAnswerCard } from './SessionAnswerCard';
import { SessionCompleteCard } from './SessionCompleteCard';
import { SessionConnectionState } from './SessionConnectionState';
import { SessionFeedbackCard } from './SessionFeedbackCard';
import { SessionHeader } from './SessionHeader';
import { SessionQuestionCard } from './SessionQuestionCard';
import { SessionStatusMessage } from './SessionStatusMessage';
import { SESSION_CONSTANTS, SESSION_STATUS, SESSION_TEXT } from './sessionConstants';
import { handleSessionSocketClose, handleSessionSocketMessage } from './sessionEventHandlers';
import { getReconnectDelay, toWsBaseUrl } from './sessionHelpers';

export default function InterviewSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const sessionData = location.state as SessionStartedDto | null;

  const ws = useRef<WebSocket | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const urlIndexRef = useRef(0);
  const countdownRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const awaitingAdvanceRef = useRef(false);
  const pendingFinishRef = useRef(false);
  const pendingQuestionRef = useRef<QuestionState | null>(null);
  const feedbackRef = useRef<FeedbackState | null>(null);
  const fallbackQuestionNumberRef = useRef(0);

  const [wsStatus, setWsStatus] = useState<WebSocketStatus>(SESSION_STATUS.CONNECTING);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<QuestionState | null>(null);
  const [answer, setAnswer] = useState('');
  const [sending, setSending] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [awaitingAdvance, setAwaitingAdvance] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sessionTotalQuestions, setSessionTotalQuestions] = useState<number | null>(null);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  useEffect(() => {
    awaitingAdvanceRef.current = awaitingAdvance;
  }, [awaitingAdvance]);

  useEffect(() => {
    pendingQuestionRef.current = pendingQuestion;
  }, [pendingQuestion]);

  useEffect(() => {
    feedbackRef.current = feedback;
  }, [feedback]);

  const clearCountdown = () => {
    if (countdownRef.current !== null) {
      globalThis.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const moveToNextQuestion = () => {
    clearCountdown();
    setCountdown(null);
    setFeedback(null);
    setAwaitingAdvance(false);
    setAnswer('');

    if (!pendingQuestionRef.current && pendingFinishRef.current) {
      pendingFinishRef.current = false;
      setFinished(true);
      return;
    }

    setPendingQuestion((queued) => {
      if (queued) {
        setCurrentQuestion(queued);
      }
      return null;
    });
  };

  const startAdvanceCountdown = () => {
    clearCountdown();
    setCountdown(SESSION_CONSTANTS.WS_CONFIG.COUNTDOWN_DURATION);
    countdownRef.current = globalThis.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) {
          return null;
        }

        if (prev <= 1) {
          moveToNextQuestion();
          return null;
        }

        return prev - 1;
      });
    }, SESSION_CONSTANTS.WS_CONFIG.COUNTDOWN_INTERVAL);
  };

  useEffect(() => {
    if (!sessionData?.workerWsHost || !sessionData?.sessionToken) {
      setSessionMessage(SESSION_TEXT.SESSION_DATA_MISSING);
      setWsStatus(SESSION_STATUS.ERROR);
      return;
    }

    const baseUrl = toWsBaseUrl(sessionData.workerWsHost);
    const urls = [`${baseUrl}/ws`, baseUrl];
    const maxAttempts = SESSION_CONSTANTS.WS_CONFIG.MAX_RECONNECT_ATTEMPTS;

    const connect = () => {
      const url = urls[urlIndexRef.current] ?? urls[0];
      const scheduleReconnect = () => {
        retryTimerRef.current = globalThis.setTimeout(connect, getReconnectDelay(reconnectAttemptsRef.current));
      };

      try {
        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => {
          reconnectAttemptsRef.current = 0;
          setWsStatus(SESSION_STATUS.CONNECTED);
          setSessionMessage(null);
          socket.send(JSON.stringify({ token: sessionData.sessionToken }));
        };

        socket.onmessage = (event) => {
          try {
            const msg: WebSocketMessage = JSON.parse(event.data);
            handleSessionSocketMessage({
              message: msg,
              sessionTotalQuestions,
              awaitingAdvanceRef,
              feedbackRef,
              pendingFinishRef,
              fallbackQuestionNumberRef,
              setPendingQuestion,
              setCurrentQuestion,
              setAnswer,
              setSessionTotalQuestions,
              setFeedback,
              setAwaitingAdvance,
              startAdvanceCountdown,
              clearCountdown,
              setFinished,
            });
          } catch {
            // Ignore non-JSON messages.
          }
        };

        socket.onclose = (event) => {
          handleSessionSocketClose({
            code: event.code,
            reason: event.reason,
            finishedRef,
            reconnectAttemptsRef,
            urlIndexRef,
            urls,
            maxAttempts,
            setWsStatus,
            setSessionMessage,
            retry: scheduleReconnect,
          });
        };

        socket.onerror = () => {
          socket.close();
        };
      } catch {
        setWsStatus(SESSION_STATUS.ERROR);
      }
    };

    connect();

    return () => {
      if (retryTimerRef.current !== null) {
        globalThis.clearTimeout(retryTimerRef.current);
      }

      clearCountdown();
      pendingFinishRef.current = false;
      ws.current?.close();
    };
  }, [sessionData?.sessionToken, sessionData?.workerWsHost]);

  const sendAnswer = () => {
    if (ws.current?.readyState !== WebSocket.OPEN || !answer.trim() || awaitingAdvance) {
      return;
    }

    setSending(true);
    try {
      ws.current.send(JSON.stringify({ answer: answer.trim() }));
      setAnswer('');
    } catch {
      setSessionMessage(SESSION_TEXT.FAILED_TO_SEND);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendAnswer();
    }
  };

  const handleEndSession = () => {
    ws.current?.close();
    navigate(ROUTES.HISTORY);
  };

  if (finished) {
    return (
      <SessionCompleteCard
        sessionId={sessionId}
        onViewResults={() => navigate(ROUTES.HISTORY_DETAIL(sessionId || ''))}
      />
    );
  }

  return (
    <div className={`flex min-h-screen ${COLORS.BG_PAGE} flex-col`}>
      <SessionHeader status={wsStatus} onEndSession={handleEndSession} />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-8">
        <SessionStatusMessage message={sessionMessage} />

        {wsStatus === SESSION_STATUS.CONNECTING && (
          <SessionConnectionState status="connecting" onStartNewSession={() => navigate(ROUTES.INTERVIEW.START)} />
        )}

        {wsStatus === SESSION_STATUS.ERROR && (
          <SessionConnectionState status="error" onStartNewSession={() => navigate(ROUTES.INTERVIEW.START)} />
        )}

        {wsStatus === SESSION_STATUS.CONNECTED && !currentQuestion && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-periwinkle border-t-cornflower" />
            <p className={`${COLORS.TEXT_TERTIARY} text-sm`}>{SESSION_TEXT.WAITING_FOR_QUESTION}</p>
          </div>
        )}

        {wsStatus === SESSION_STATUS.CONNECTED && currentQuestion && (
          <div className="w-full">
            <SessionQuestionCard question={currentQuestion} totalQuestions={sessionTotalQuestions} />

            {feedback && (
              <SessionFeedbackCard
                feedback={feedback}
                countdown={countdown}
                pendingNextQuestion={!!pendingQuestion}
                onNextQuestion={moveToNextQuestion}
              />
            )}

            <SessionAnswerCard
              answer={answer}
              sending={sending}
              disabled={awaitingAdvance}
              onAnswerChange={setAnswer}
              onSubmit={sendAnswer}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
      </div>
    </div>
  );
}
