import { COLORS, FONTS } from '../../constants';
import type { HomeStatsSectionProps } from './HomePageTypes';

export const HomeStatsSection = ({ stats }: HomeStatsSectionProps) => (
  <section className={`grid grid-cols-3 gap-8 border-t py-16 text-center ${COLORS.BORDER_PRIMARY}`}>
    {stats.map((stat) => (
      <div key={stat.label}>
        <div className="text-4xl text-navy" style={FONTS.SERIF_DISPLAY}>
          {stat.value}
        </div>
        <div className="mt-1 text-sm text-navy/50">{stat.label}</div>
      </div>
    ))}
  </section>
);
