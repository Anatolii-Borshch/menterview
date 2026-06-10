import type { AdminQuestionListItemDto } from '../../api/models/adminModels';
import type { TagDto } from '../../api/models/referenceModels';

export interface AdminPendingQuestionsState {
  questions: AdminQuestionListItemDto[];
  allTags: TagDto[];
  loading: boolean;
  expandedId: number | null;
  rejectId: number | null;
  acting: number | null;
}
