import time
from app.session.manager import SessionState
from generated import callback_pb2

def build_finish_payload(state: SessionState) -> callback_pb2.FinishSessionPayload:
    total_time = int(time.time() - state.started_at)

    answers = [
        callback_pb2.SubmittedAnswer(
            question_id=a.question_id,
            answer_text=a.answer_text,
            ai_reply=a.ai_reply,
            accuracy=a.accuracy,
            answering_time=a.answering_time,
            was_rephrased=a.was_rephrased,
            was_weak_topic=a.was_weak_topic,
        )
        for a in state.answers
    ]

    return callback_pb2.FinishSessionPayload(
        session_id=state.session_id,
        total_time=total_time,
        answers=answers,
        ai_questions=[],
    )