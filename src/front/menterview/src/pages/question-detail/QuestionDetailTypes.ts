import type { CheckAnswerResponse, QuestionDetailsDto } from '../../api/models/questionModels';

export interface QuestionTopBarProps {
  isAdmin: boolean;
  deleting: boolean;
  onDelete: () => void;
}

export interface QuestionMetaProps {
  question: QuestionDetailsDto;
  rephrased: string | null;
  difficultyClassName: string;
}

export interface RephraseActionsProps {
  rephrased: string | null;
  rephrasing: boolean;
  onRephrase: () => void;
  onShowOriginal: () => void;
}

export interface AnswerCheckPanelProps {
  userAnswer: string;
  checking: boolean;
  checkResult: CheckAnswerResponse | null;
  onUserAnswerChange: (value: string) => void;
  onCheckAnswer: () => void;
  onClearResult: () => void;
}

export interface ExpectedAnswerPanelProps {
  answer: string;
  showAnswer: boolean;
  onToggleShowAnswer: () => void;
}
