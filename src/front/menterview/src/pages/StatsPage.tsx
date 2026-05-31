import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import interviewApi from '../api/interviewApi';
import type { SessionTrendPointDto, UserSessionStatsDto } from '../api/models/sessionModels';

type Granularity = 'day' | 'week' | 'month';

export default function StatsPage() {
  const [stats, setStats] = useState<UserSessionStatsDto | null>(null);
  const trend: SessionTrendPointDto[] = stats?.trend ?? [];
  const [loading, setLoading] = useState(true);
  const [granularity, setGranularity] = useState<Granularity>('week');

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await interviewApi.getStats({ granularity });
        if (!cancelled && res.data.isSuccess) setStats(res.data.data);
      } catch {
        if (!cancelled) toast.error('Failed to load stats.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStats();
    return () => { cancelled = true; };
  }, [granularity]);

  const maxScore = Math.max(...trend.map((t) => t.averageAccuracy), 100);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: granularity !== 'month' ? 'numeric' : undefined,
    } as Intl.DateTimeFormatOptions);

  const avg = (arr: number[]) =>
    arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

  const avgScore = avg(trend.map((t) => t.averageAccuracy));
  const avgAnswered = avg(trend.map((t) => t.answeredCount));

  return (
    <div className="min-h-screen bg-snow">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl text-navy mb-8" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Statistics
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total sessions', value: stats?.totalSessionsCount ?? 0 },
            { label: 'Avg. score', value: `${avgScore}%` },
            { label: 'Avg. answered', value: avgAnswered },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-periwinkle rounded-2xl p-5 text-center">
              <p className="text-2xl font-semibold text-navy">{s.value}</p>
              <p className="text-xs text-navy/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {(['day', 'week', 'month'] as Granularity[]).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`px-4 py-1.5 rounded-full border text-xs transition-colors capitalize ${
                granularity === g
                  ? 'border-cornflower bg-cornflower/5 text-navy font-medium'
                  : 'border-periwinkle text-navy/60 hover:border-navy/30'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="bg-white border border-periwinkle rounded-2xl p-6">
          <p className="text-xs text-navy/40 mb-4">Score over time</p>

          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-navy/30 text-sm">Loading…</p>
            </div>
          ) : trend.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-navy/30 text-sm">No data for this period.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-end gap-1 h-48">
                {trend.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div className="relative w-full">
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                        <div className="bg-navy text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                          {Math.round(point.averageAccuracy)}% · {formatDate(point.time)}
                        </div>
                      </div>
                      <div
                        className="w-full bg-cornflower/80 hover:bg-cornflower rounded-t-sm transition-colors"
                        style={{ height: `${(point.averageAccuracy / maxScore) * 160}px` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex mt-2 text-xs text-navy/30">
                {trend
                  .filter((_, i) => i === 0 || i === trend.length - 1 || i % Math.ceil(trend.length / 4) === 0)
                  .map((point, i) => (
                    <span
                      key={i}
                      className="flex-1 text-center"
                      style={{ flexBasis: `${100 / trend.length}%` }}
                    >
                      {formatDate(point.time)}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
