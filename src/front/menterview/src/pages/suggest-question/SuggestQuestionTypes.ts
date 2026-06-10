import type { CategoryDto, DifficultyDto, TagDto } from '../../api/models/referenceModels';

export interface SuggestQuestionFormState {
  questionText: string;
  answer: string;
  categoryId: number;
  difficultyId: number;
  tagIds: number[];
}

export interface SuggestQuestionFormProps {
  form: SuggestQuestionFormState;
  categories: CategoryDto[];
  difficulties: DifficultyDto[];
  tags: TagDto[];
  loading: boolean;
  tagsLoading: boolean;
  tagsError: string | null;
  onFormChange: (next: SuggestQuestionFormState) => void;
  onToggleTag: (tagId: number) => void;
  onRetryTags: () => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent) => void;
}
