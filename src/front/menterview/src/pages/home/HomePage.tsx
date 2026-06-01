import { HOME_PAGE, SPACING } from '../../constants';
import { HomeHeroSection } from './HomeHeroSection';
import { getPrimaryCtaText } from './HomePageHelpers';
import { HomeStatsSection } from './HomeStatsSection';

export const HomePage = () => {
  const primaryCtaText = getPrimaryCtaText();
  const stats = [...HOME_PAGE.STATS];

  return (
    <div className={`mx-auto max-w-7xl ${SPACING.CONTAINER_PADDING}`}>
      <HomeHeroSection primaryCtaText={primaryCtaText} />
      <HomeStatsSection stats={stats} />
    </div>
  );
};
