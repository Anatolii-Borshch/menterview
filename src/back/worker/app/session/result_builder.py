import time
from app.session.manager import SessionState

def build_finish_payload(state: SessionState) -> dict:
    """Build the JSON body for POST /api/sessions/finish."""
    total_time = int(time.time() - state.started_at)

    answers = [
        {
            "questionId":        a.question_id,
            "answerText":        a.answer_text,
            "aiReply":           a.ai_reply,
            "accuracy":          a.accuracy,
            "answeringTime":     a.answering_time,
            "wasRephrased":      a.was_rephrased,
            "wasWeakTopicReview": a.was_weak_topic,
        }
        for a in state.answers
    ]

    return {
        "sessionId":            state.session_id,
        "totalTime":            total_time,
        "answers":              answers,
        "aiGeneratedQuestions": state.ai_questions,
    }
