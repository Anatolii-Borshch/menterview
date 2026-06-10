import type { CategoryDto, DifficultyDto } from '../../api/models/referenceModels';

export interface InterviewStartFormState {
  categoryId: number | undefined;
  difficultyId: number | undefined;
  questionsAmount: number;
  includeWeakTopics: boolean;
}

export interface ToggleChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export interface InterviewStartFormProps {
  categories: CategoryDto[];
  difficulties: DifficultyDto[];
  form: InterviewStartFormState;
  refLoading: boolean;
  starting: boolean;
  onToggleCategory: (categoryId: number | undefined) => void;
  onToggleDifficulty: (difficultyId: number | undefined) => void;
  onQuestionsAmountChange: (questionsAmount: number) => void;
  onToggleWeakTopics: () => void;
  onStart: () => void;
}
