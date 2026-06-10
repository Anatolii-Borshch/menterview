import type { QuestionListItemDto } from '../../api/models/questionModels';
import type { CategoryDto, DifficultyDto, TagDto } from '../../api/models/referenceModels';

export interface QuestionFiltersProps {
  search: string;
  categoryId: number | undefined;
  difficultyId: number | undefined;
  selectedTagIds: number[];
  categories: CategoryDto[];
  difficulties: DifficultyDto[];
  tags: TagDto[];
  onSearchChange: (value: string | undefined) => void;
  onCategoryChange: (value: string | undefined) => void;
  onDifficultyChange: (value: string | undefined) => void;
  onToggleTag: (tagId: number) => void;
  onClearFilters: () => void;
}

export interface QuestionListProps {
  questions: QuestionListItemDto[];
  isAdmin: boolean;
  deletingId: number | null;
  onDelete: (questionId: number) => void;
  difficultyColor: Record<string, string>;
}

export interface QuestionsPaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}
