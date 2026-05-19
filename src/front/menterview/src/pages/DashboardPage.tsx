import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../api/useAuthStore';
import profileApi from '../api/profileApi';
import interviewApi from '../api/interviewApi';
import type { UserProfileDto } from '../api/models/profileModels';
import type { SessionListItemDto } from '../api/models/sessionModels';

export default function DashboardPage() {
  const { userId } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [sessions, setSessions] = useState<SessionListItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profRes, sesRes] = await Promise.all([
          profileApi.getProfile(),
          interviewApi.getSessions({ pageSize: 3 }),
        ]);
        if (profRes.data.isSuccess) setProfile(profRes.data.data);
        if (sesRes.data.isSuccess) setSessions(sesRes.data.data.items);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const avgScore =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, ses) => s + ses.score, 0) / sessions.length)
      : null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <p className="text-navy/40 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {profile ? `Welcome back, ${profile.firstName}` : 'Dashboard'}
          </h1>
          {profile && (
            <p className="text-navy/50 mt-1 text-sm">
              {profile.category.categoryName}
              {profile.level ? ` · ${profile.level.levelName}` : ''}
              {profile.difficulty ? ` · ${profile.difficulty.difficultyName}` : ''}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Sessions done', value: sessions.length > 0 ? `${sessions.length}+` : '0', sub: 'total' },
            { label: 'Avg. score', value: avgScore !== null ? `${avgScore}%` : '—', sub: 'last 3 sessions' },
            { label: 'Focus area', value: profile?.category.categoryName ?? '—', sub: 'category' },
            { label: 'Level', value: profile?.level?.levelName ?? '—', sub: 'current level' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-periwinkle rounded-2xl p-5">
              <p className="text-xs text-navy/40 mb-1">{stat.label}</p>
              <p className="text-2xl text-navy font-semibold">{stat.value}</p>
              <p className="text-xs text-navy/30 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/interview/start"
            className="group bg-navy hover:bg-cornflower text-white rounded-2xl p-6 flex items-center gap-4 transition-colors"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm">Start Interview</p>
              <p className="text-white/60 text-xs mt-0.5">Launch an AI-powered mock session</p>
            </div>
          </Link>

          <Link
            to="/questions"
            className="group bg-white hover:border-cornflower border border-periwinkle text-navy rounded-2xl p-6 flex items-center gap-4 transition-colors"
          >
            <div className="w-10 h-10 bg-cornflower/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-cornflower" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm">Browse Questions</p>
              <p className="text-navy/50 text-xs mt-0.5">Explore the question bank</p>
            </div>
          </Link>
        </div>

        {/* Recent sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
              Recent sessions
            </h2>
            <Link to="/history" className="text-sm text-cornflower hover:underline">
              View all →
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white border border-periwinkle rounded-2xl p-8 text-center">
              <p className="text-navy/40 text-sm mb-3">No sessions yet</p>
              <Link
                to="/interview/start"
                className="inline-block bg-navy text-white text-sm px-4 py-2 rounded-lg hover:bg-cornflower transition-colors"
              >
                Start your first interview
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((ses) => (
                <Link
                  key={ses.sessionId}
                  to={`/history/${ses.sessionId}`}
                  className="block bg-white border border-periwinkle rounded-xl p-4 hover:border-cornflower/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-navy">{ses.categoryName}</p>
                      <p className="text-xs text-navy/40 mt-0.5">
                        {ses.questionsAmount} questions · {formatTime(ses.totalTime)} · {formatDate(ses.createdAt)}
                      </p>
                    </div>
                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      ses.score >= 80
                        ? 'bg-green-50 text-green-700'
                        : ses.score >= 60
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {ses.score}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
