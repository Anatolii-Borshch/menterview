import type { InterviewStartFormState } from './interview-start-types';
import { INTERVIEW_START_CONSTANTS } from './interviewStartConstants';

export const createInitialInterviewStartForm = (): InterviewStartFormState => ({
  categoryId: undefined,
  difficultyId: undefined,
  questionsAmount: 10,
  includeWeakTopics: false,
});

export const getInterviewStartWeakTopicRatio = (includeWeakTopics: boolean): number =>
  includeWeakTopics ? INTERVIEW_START_CONSTANTS.WEAK_TOPIC_RATIO : 0;
