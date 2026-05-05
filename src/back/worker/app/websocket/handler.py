import asyncio
import json
import time
import websockets
from app.session.manager import SessionManager, AnswerRecord
from app.session.question_list import SessionQuestion
from app.llm.rephraser import Rephraser
from app.llm.scorer import Scorer
from app.callback.client import CallbackClient
from app.session.result_builder import build_finish_payload

class SessionHandler:
    def __init__(
        self,
        manager:  SessionManager,
        rephraser: Rephraser,
        scorer:    Scorer,
        callback:  CallbackClient,
    ):
        self._manager   = manager
        self._rephraser = rephraser
        self._scorer    = scorer
        self._callback  = callback

    async def handle(self, websocket):
        state = await self._manager.get_state()

        if not state:
            await websocket.close(1011, "Session not initialized")
            return

        try:
            auth = await asyncio.wait_for(websocket.recv(), timeout=10.0)
            token_msg = json.loads(auth)
            if token_msg.get("token") != state.session_token:
                await websocket.close(1008, "Invalid session token")
                return
        except asyncio.TimeoutError:
            await websocket.close(1008, "Auth timeout")
            return

        await websocket.send(json.dumps({"event": "session_started"}))

        for question in state.questions:
            display_text = (
                question.rephrased_text
                if question.is_weak_topic and question.rephrased_text
                else question.question_text
            )

            await websocket.send(json.dumps({
                "event":          "question",
                "question_id":    question.question_id,
                "question_text":  display_text,
                "is_weak_topic":  question.is_weak_topic,
            }))

            start_time = time.time()

            try:
                raw = await asyncio.wait_for(
                    websocket.recv(),
                    timeout=300.0  # 5 min per question max
                )
                msg = json.loads(raw)
                user_answer    = msg.get("answer", "")
                answering_time = int(time.time() - start_time)

                accuracy, ai_reply = await asyncio.to_thread(
                    self._scorer.score,
                    display_text,
                    question.answer,
                    user_answer,
                )

                await self._manager.record_answer(AnswerRecord(
                    question_id=question.question_id,
                    answer_text=user_answer,
                    ai_reply=ai_reply,
                    accuracy=accuracy,
                    answering_time=answering_time,
                    was_rephrased=bool(
                        question.is_weak_topic and question.rephrased_text
                    ),
                    was_weak_topic=question.is_weak_topic,
                ))

                await websocket.send(json.dumps({
                    "event":    "answer_feedback",
                    "accuracy": accuracy,
                    "ai_reply": ai_reply,
                }))

            except asyncio.TimeoutError:
                await websocket.send(json.dumps({
                    "event":   "question_timeout",
                    "message": "Time limit exceeded for this question",
                }))

        await websocket.send(json.dumps({"event": "session_finished"}))
        await self._manager.mark_finished()

        state = await self._manager.get_state()
        payload = build_finish_payload(state)
        await asyncio.to_thread(self._callback.finish, payload)