import { DashboardStartInterviewAction } from './DashboardStartInterviewAction';
import { DashboardBrowseQuestionsAction } from './DashboardBrowseQuestionsAction';

export const DashboardQuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <DashboardStartInterviewAction />
      <DashboardBrowseQuestionsAction />
    </div>
  );
};
