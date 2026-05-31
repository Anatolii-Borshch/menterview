import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import type { SessionStartedDto } from '../api/models/sessionModels';

type WsStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WsMessage {
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

interface QuestionState {
  text: string;
  number?: number;
  total?: number;
  isRephrased: boolean;
}

interface FeedbackState {
  aiReply: string;
  accuracy?: number;
  correctness?: number;
  completeness?: number;
}

function toWsBaseUrl(host: string): string {
  if (host.startsWith('ws://') || host.startsWith('wss://')) return host;
  if (host.startsWith('http://')) return `ws://${host.slice('http://'.length)}`;
  if (host.startsWith('https://')) return `wss://${host.slice('https://'.length)}`;
  return `ws://${host}`;
}

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

  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');
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
      window.clearInterval(countdownRef.current);
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
    setCountdown(10);
    countdownRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          moveToNextQuestion();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!sessionData?.workerWsHost || !sessionData?.sessionToken) {
      setSessionMessage('Session data missing. Cannot connect.');
      setWsStatus('error');
      return;
    }

    const baseUrl = toWsBaseUrl(sessionData.workerWsHost);
    const urls = [`${baseUrl}/ws`, baseUrl];
    const maxAttempts = 8;

    const connect = () => {
      const url = urls[urlIndexRef.current] ?? urls[0];

      try {
        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => {
          reconnectAttemptsRef.current = 0;
          setWsStatus('connected');
          setSessionMessage(null);
          socket.send(JSON.stringify({ token: sessionData.sessionToken }));
        };

        socket.onmessage = (event) => {
          try {
            const msg: WsMessage = JSON.parse(event.data);

            if (msg.event === 'question' && msg.question_text) {
              const questionNumber =
                typeof msg.question_number === 'number'
                  ? msg.question_number
                  : fallbackQuestionNumberRef.current + 1;
              fallbackQuestionNumberRef.current = questionNumber;

              const incoming: QuestionState = {
                text: msg.question_text,
                number: questionNumber,
                total:
                  typeof msg.total_questions === 'number'
                    ? msg.total_questions
                    : sessionTotalQuestions ?? undefined,
                isRephrased: !!msg.is_rephrased,
              };

              if (awaitingAdvanceRef.current) {
                setPendingQuestion(incoming);
              } else {
                setCurrentQuestion(incoming);
                setAnswer('');
              }
            }

            if (msg.event === 'session_finished') {
              if (awaitingAdvanceRef.current || feedbackRef.current !== null) {
                pendingFinishRef.current = true;
              } else {
                clearCountdown();
                setFinished(true);
              }
            }

            if (msg.event === 'session_started' && typeof msg.total_questions === 'number') {
              setSessionTotalQuestions(msg.total_questions);
            }

            if (msg.event === 'answer_feedback') {
              setFeedback({
                aiReply: msg.ai_reply ?? 'No feedback returned by AI.',
                accuracy: msg.accuracy,
                correctness: msg.correctness,
                completeness: msg.completeness,
              });
              setAwaitingAdvance(true);
              startAdvanceCountdown();
            }

            if (msg.event === 'question_timeout') {
              setFeedback({ aiReply: msg.message ?? 'Time limit exceeded for this question.' });
              setAwaitingAdvance(true);
              startAdvanceCountdown();
            }
          } catch {
            // non-JSON message
          }
        };

        socket.onclose = (event) => {
          if (finishedRef.current) {
            setWsStatus('disconnected');
            return;
          }

          if (event.code === 1008) {
            setWsStatus('error');
            setSessionMessage(event.reason || 'Session authorization failed. Please start a new interview.');
            return;
          }

          if (reconnectAttemptsRef.current < maxAttempts) {
            setWsStatus('connecting');

            if (urlIndexRef.current < urls.length - 1) {
              urlIndexRef.current += 1;
            }

            const delay = 500 * (reconnectAttemptsRef.current + 1);
            reconnectAttemptsRef.current += 1;
            retryTimerRef.current = window.setTimeout(connect, delay);
            return;
          }

          setWsStatus('error');
          const reason = event.reason ? ` (${event.reason})` : '';
          setSessionMessage(`Interview session disconnected [${event.code}]${reason}.`);
        };

        socket.onerror = () => {
          socket.close();
        };
      } catch {
        setWsStatus('error');
      }
    };

    connect();

    return () => {
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
      }
      clearCountdown();
      pendingFinishRef.current = false;
      ws.current?.close();
    };
  }, [sessionData?.sessionToken, sessionData?.workerWsHost]);

  const shownQuestionNumber = currentQuestion?.number;
  const shownTotalQuestions = currentQuestion?.total ?? sessionTotalQuestions;

  const sendAnswer = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !answer.trim() || awaitingAdvance) return;
    setSending(true);
    try {
      ws.current.send(JSON.stringify({ answer: answer.trim() }));
      setAnswer('');
    } catch {
      setSessionMessage('Failed to send answer. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAnswer();
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center px-4">
        <div className="bg-white border border-periwinkle rounded-2xl p-10 text-center max-w-sm">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl text-navy mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Interview complete!
          </h1>
          <p className="text-navy/50 text-sm mb-6">Your answers have been evaluated by AI.</p>
          <button
            onClick={() => navigate(`/history/${sessionId}`)}
            className="w-full bg-navy hover:bg-cornflower text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            View results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow flex flex-col">
      <div className="bg-white border-b border-periwinkle px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-navy">Interview session</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            wsStatus === 'connected'
              ? 'border-green-100 bg-green-50 text-green-600'
              : wsStatus === 'connecting'
              ? 'border-yellow-100 bg-yellow-50 text-yellow-600'
              : 'border-red-100 bg-red-50 text-red-500'
          }`}>
            {wsStatus}
          </span>
        </div>
        <button
          onClick={() => { ws.current?.close(); navigate('/history'); }}
          className="text-xs text-navy/40 hover:text-navy transition-colors"
        >
          End session
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl w-full mx-auto">
        {sessionMessage && (
          <div className="w-full mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {sessionMessage}
          </div>
        )}

        {wsStatus === 'connecting' && (
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-cornflower border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-navy/50 text-sm">Connecting to session…</p>
          </div>
        )}

        {wsStatus === 'error' && (
          <div className="text-center">
            <p className="text-navy/40 text-sm mb-4">Failed to connect to the interview session.</p>
            <button
              onClick={() => navigate('/interview/start')}
              className="text-cornflower text-sm hover:underline"
            >
              Start a new session
            </button>
          </div>
        )}

        {wsStatus === 'connected' && !currentQuestion && (
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-periwinkle border-t-cornflower rounded-full animate-spin mx-auto mb-4" />
            <p className="text-navy/50 text-sm">Waiting for question…</p>
          </div>
        )}

        {wsStatus === 'connected' && currentQuestion && (
          <div className="w-full">
            <div className="bg-white border border-periwinkle rounded-2xl p-8 mb-4">
              <div className="flex items-center justify-between mb-4 gap-3">
                <p className="text-xs text-navy/40">
                  {typeof shownQuestionNumber === 'number'
                    ? `Question ${shownQuestionNumber}${typeof shownTotalQuestions === 'number' ? `/${shownTotalQuestions}` : ''}`
                    : 'Question'}
                </p>
                {currentQuestion.isRephrased && (
                  <span className="text-[11px] px-2 py-1 rounded-full border border-cornflower/30 bg-cornflower/10 text-cornflower">
                    Rephrased by AI
                  </span>
                )}
              </div>
              <h2 className="text-xl text-navy leading-relaxed" style={{ fontFamily: 'DM Serif Display, serif' }}>
                {currentQuestion.text}
              </h2>
            </div>

            {feedback && (
              <div className="bg-white border border-periwinkle rounded-2xl p-4 mb-4">
                <p className="text-xs text-navy/40 mb-2">AI feedback</p>
                {countdown !== null && (
                  <div className="w-full h-1.5 bg-periwinkle/30 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-cornflower transition-all duration-1000 ease-linear"
                      style={{ width: `${Math.max(0, (countdown / 10) * 100)}%` }}
                    />
                  </div>
                )}
                <p className="text-sm text-navy mb-3 whitespace-pre-wrap">{feedback.aiReply}</p>
                <div className="flex flex-wrap gap-2 text-xs mb-3">
                  {typeof feedback.accuracy === 'number' && (
                    <span className="px-2 py-1 rounded-full border border-periwinkle text-navy/70">
                      Accuracy: {feedback.accuracy}%
                    </span>
                  )}
                  {typeof feedback.correctness === 'number' && (
                    <span className="px-2 py-1 rounded-full border border-periwinkle text-navy/70">
                      Correctness: {feedback.correctness}%
                    </span>
                  )}
                  {typeof feedback.completeness === 'number' && (
                    <span className="px-2 py-1 rounded-full border border-periwinkle text-navy/70">
                      Completeness: {feedback.completeness}%
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-navy/50">
                    {countdown !== null
                      ? `Next question in ${countdown}s`
                      : pendingQuestion
                      ? 'Next question is ready.'
                      : 'Waiting for next question...'}
                  </p>
                  <button
                    onClick={moveToNextQuestion}
                    disabled={!pendingQuestion && countdown === null}
                    className="bg-navy hover:bg-cornflower text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Next question
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-periwinkle rounded-2xl p-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
                rows={5}
                disabled={awaitingAdvance}
                className="w-full text-sm text-navy focus:outline-none resize-none placeholder:text-navy/30 disabled:opacity-60"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={sendAnswer}
                  disabled={sending || !answer.trim() || awaitingAdvance}
                  className="bg-navy hover:bg-cornflower text-white text-sm px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending…' : 'Send answer →'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
