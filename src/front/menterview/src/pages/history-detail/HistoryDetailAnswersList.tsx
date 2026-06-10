import type { AnswerBreakdownDto } from '../../api/models/sessionModels';
import { HISTORY_DETAIL_TEXT } from './HistoryDetailConstants';
import { HistoryDetailAnswerItem } from './HistoryDetailAnswerItem';

interface HistoryDetailAnswersListProps {
  answers: AnswerBreakdownDto[];
  expandedIndex: number | null;
  onToggleExpanded: (index: number) => void;
}

export const HistoryDetailAnswersList = ({
  answers,
  expandedIndex,
  onToggleExpanded,
}: HistoryDetailAnswersListProps) => (
  <>
    <h2 className="mb-4 text-lg text-navy" style={{ fontFamily: 'DM Serif Display, serif' }}>
      {HISTORY_DETAIL_TEXT.ANSWER_BREAKDOWN}
    </h2>

    <div className="space-y-3">
      {answers.map((answer, index) => (
        <HistoryDetailAnswerItem
          key={answer.answerId}
          answer={answer}
          index={index}
          isExpanded={expandedIndex === index}
          onToggle={onToggleExpanded}
        />
      ))}
    </div>
  </>
);
