import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import interviewApi from '../../api/interviewApi';
import type { UserSessionStatsDto } from '../../api/models/sessionModels';
import { GranularitySelector } from './GranularitySelector';
import { STATS_TEXT } from './StatsConstants';
import { averageFromList, buildStatsSummaryCards } from './StatsHelpers';
import { StatsSummaryCards } from './StatsSummaryCards';
import { StatsTrendChart } from './StatsTrendChart';
import type { Granularity } from './StatsTypes';

export default function StatsPage() {
  const [stats, setStats] = useState<UserSessionStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [granularity, setGranularity] = useState<Granularity>('week');

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await interviewApi.getStats({ granularity });
        if (!cancelled && response.data.isSuccess) {
          setStats(response.data.data);
        }
      } catch {
        if (!cancelled) {
          toast.error(STATS_TEXT.LOAD_FAILED);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [granularity]);

  const trend = stats?.trend ?? [];
  const avgScore = averageFromList(trend.map((point) => point.averageAccuracy));
  const avgAnswered = averageFromList(trend.map((point) => point.answeredCount));
  const summaryCards = buildStatsSummaryCards(stats?.totalSessionsCount ?? 0, avgScore, avgAnswered);

  return (
    <div className="min-h-screen bg-snow">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-8 text-3xl text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {STATS_TEXT.TITLE}
        </h1>

        <StatsSummaryCards cards={summaryCards} />
        <GranularitySelector value={granularity} onChange={setGranularity} />
        <StatsTrendChart trend={trend} loading={loading} granularity={granularity} />
      </div>
    </div>
  );
}
