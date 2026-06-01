import type { AnswerBreakdownDto, SessionDetailsDto } from '../../api/models/sessionModels';
import { HISTORY_DETAIL_TEXT, SCORE_COLOR } from './HistoryDetailConstants';
import type { SessionStatItem } from './HistoryDetailTypes';

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${remainderSeconds}s`;
  }
  return `${remainderSeconds}s`;
};

export const formatSessionDate = (time: string) =>
  new Date(time).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const getScoreColorClassName = (score: number) => {
  if (score >= 80) {
    return SCORE_COLOR.high;
  }
  if (score >= 60) {
    return SCORE_COLOR.medium;
  }
  return SCORE_COLOR.low;
};

export const getCorrectnessColorClassName = (correctness: number) => {
  if (correctness >= 80) {
    return SCORE_COLOR.high;
  }
  if (correctness >= 50) {
    return SCORE_COLOR.medium;
  }
  return SCORE_COLOR.low;
};

export const buildSessionStatItems = (session: SessionDetailsDto, score: number): SessionStatItem[] => [
  { label: HISTORY_DETAIL_TEXT.QUESTIONS, value: session.questionsAmount },
  { label: HISTORY_DETAIL_TEXT.ANSWERED, value: session.answeredCount },
  { label: HISTORY_DETAIL_TEXT.DURATION, value: formatTime(session.totalTime) },
  { label: HISTORY_DETAIL_TEXT.ACCURACY, value: `${score}%` },
];

export const getAnswerSafeText = (answerText: string) => answerText.trim();

export const getAnswerCorrectness = (answer: AnswerBreakdownDto) => answer.correctness ?? 0;

export const getAnswerCompleteness = (answer: AnswerBreakdownDto) => answer.completeness ?? 0;
