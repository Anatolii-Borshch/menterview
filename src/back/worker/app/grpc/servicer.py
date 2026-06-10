from app.session.manager import SessionManager
from app.session.question_list import parse_questions
from generated import session_pb2, session_pb2_grpc

class SessionServicer(session_pb2_grpc.SessionServiceServicer):
    def __init__(self, manager: SessionManager):
        self._manager = manager

    async def InitializeSession(self, request, context):
        questions = [
            {
                "question_id":    q.question_id,
                "question_text":  q.question_text,
                "answer":         q.answer,
                "category_id":    q.category_id,
                "difficulty_id":  q.difficulty_id,
                "is_weak_topic":  q.is_weak_topic,
                "rephrased_text": q.rephrased_text,
            }
            for q in request.questions
        ]

        await self._manager.initialize(
            session_id=request.session_id,
            session_token=request.session_token,
            questions=parse_questions(questions),
        )

        return session_pb2.InitializeSessionResponse(
            success=True,
            message="Session initialized",
        )

    async def TerminateSession(self, request, context):
        await self._manager.mark_finished()
        return session_pb2.TerminateSessionResponse(success=True)