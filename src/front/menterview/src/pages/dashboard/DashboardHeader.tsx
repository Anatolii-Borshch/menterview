import { FONTS, COLORS } from '../../constants';
import type { DashboardProfile } from './dashboardTypes';

interface DashboardHeaderProps {
  profile: DashboardProfile | null;
  titleFallback: string;
}

export const DashboardHeader = ({ profile, titleFallback }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl text-navy" style={FONTS.SERIF_DISPLAY}>
        {profile ? `${titleFallback}, ${profile.firstName}` : titleFallback}
      </h1>
      {profile && (
        <p className={`${COLORS.TEXT_TERTIARY} mt-1 text-sm`}>
          {profile.category.categoryName}
          {profile.level ? ` · ${profile.level.levelName}` : ''}
          {profile.difficulty ? ` · ${profile.difficulty.difficultyName}` : ''}
        </p>
      )}
    </div>
  );
};
