import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { SessionStartedDto } from '../api/models/sessionModels';

type WsStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WsMessage {
  type: string;
  payload: unknown;
}

export default function InterviewSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const sessionData = location.state as SessionStartedDto | null;

  const ws = useRef<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting');
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [sending, setSending] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!sessionData?.workerWsHost || !sessionData?.sessionToken) {
      toast.error('Session data missing. Cannot connect.');
      setWsStatus('error');
      return;
    }

    const url = `${sessionData.workerWsHost}/ws?token=${encodeURIComponent(sessionData.sessionToken)}`;

    try {
      const socket = new WebSocket(url);
      ws.current = socket;

      socket.onopen = () => setWsStatus('connected');

      socket.onmessage = (event) => {
        try {
          const msg: WsMessage = JSON.parse(event.data);
          if (msg.type === 'question') {
            const payload = msg.payload as { question: string };
            setCurrentQuestion(payload.question);
            setAnswer('');
          }
          if (msg.type === 'finished') {
            setFinished(true);
            toast.success('Interview complete!');
          }
        } catch {
          // non-JSON message
        }
      };

      socket.onclose = () => setWsStatus('disconnected');
      socket.onerror = () => {
        setWsStatus('error');
        toast.error('WebSocket connection failed.');
      };
    } catch {
      setWsStatus('error');
    }

    return () => {
      ws.current?.close();
    };
  }, [sessionData]);

  const sendAnswer = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !answer.trim()) return;
    setSending(true);
    try {
      ws.current.send(JSON.stringify({ type: 'answer', payload: { answer: answer.trim() } }));
      setAnswer('');
    } catch {
      toast.error('Failed to send answer.');
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
      {/* Header */}
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

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl w-full mx-auto">
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
            <p className="text-navy/50 text-sm">Waiting for first question…</p>
          </div>
        )}

        {wsStatus === 'connected' && currentQuestion && (
          <div className="w-full">
            <div className="bg-white border border-periwinkle rounded-2xl p-8 mb-4">
              <p className="text-xs text-navy/40 mb-4">Question</p>
              <h2 className="text-xl text-navy leading-relaxed" style={{ fontFamily: 'DM Serif Display, serif' }}>
                {currentQuestion}
              </h2>
            </div>

            <div className="bg-white border border-periwinkle rounded-2xl p-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
                rows={5}
                className="w-full text-sm text-navy focus:outline-none resize-none placeholder:text-navy/30"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={sendAnswer}
                  disabled={sending || !answer.trim()}
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
