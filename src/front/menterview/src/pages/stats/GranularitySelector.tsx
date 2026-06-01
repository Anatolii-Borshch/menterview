import { STATS_GRANULARITIES } from './StatsConstants';
import type { GranularitySelectorProps } from './StatsTypes';

export const GranularitySelector = ({ value, onChange }: GranularitySelectorProps) => (
  <div className="mb-6 flex gap-2">
    {STATS_GRANULARITIES.map((granularity) => (
      <button
        key={granularity}
        onClick={() => onChange(granularity)}
        className={`capitalize rounded-full border px-4 py-1.5 text-xs transition-colors ${
          value === granularity
            ? 'border-cornflower bg-cornflower/5 font-medium text-navy'
            : 'border-periwinkle text-navy/60 hover:border-navy/30'
        }`}
      >
        {granularity}
      </button>
    ))}
  </div>
);
