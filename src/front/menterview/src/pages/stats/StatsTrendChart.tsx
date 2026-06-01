import { STATS_TEXT } from './StatsConstants';
import { formatStatsDate, getTrendAxisPoints, getTrendMaxScore } from './StatsHelpers';
import type { StatsTrendChartProps } from './StatsTypes';

export const StatsTrendChart = ({ trend, loading, granularity }: StatsTrendChartProps) => {
  const maxScore = getTrendMaxScore(trend);
  const axisPoints = getTrendAxisPoints(trend);
  const renderBody = () => {
    if (loading) {
      return (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm text-navy/30">{STATS_TEXT.LOADING}</p>
        </div>
      );
    }

    if (trend.length === 0) {
      return (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm text-navy/30">{STATS_TEXT.NO_DATA}</p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="flex h-48 items-end gap-1">
          {trend.map((point) => (
            <div
              key={`${point.time}-${Math.round(point.averageAccuracy)}-${point.answeredCount}`}
              className="group flex flex-1 flex-col items-center gap-1"
            >
              <div className="relative w-full">
                <div className="absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 group-hover:block">
                  <div className="whitespace-nowrap rounded-lg bg-navy px-2 py-1 text-xs text-white">
                    {Math.round(point.averageAccuracy)}% · {formatStatsDate(point.time, granularity)}
                  </div>
                </div>
                <div
                  className="w-full rounded-t-sm bg-cornflower/80 transition-colors hover:bg-cornflower"
                  style={{ height: `${(point.averageAccuracy / maxScore) * 160}px` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex text-xs text-navy/30">
          {axisPoints.map((point) => (
            <span
              key={`${point.time}-${Math.round(point.averageAccuracy)}`}
              className="flex-1 text-center"
              style={{ flexBasis: `${100 / trend.length}%` }}
            >
              {formatStatsDate(point.time, granularity)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-periwinkle bg-white p-6">
      <p className="mb-4 text-xs text-navy/40">{STATS_TEXT.SCORE_OVER_TIME}</p>

      {renderBody()}
    </div>
  );
};
