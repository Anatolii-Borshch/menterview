import asyncio
import json
import time
import logging
import websockets
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK
from app.session.manager import SessionManager, AnswerRecord
from app.session.question_list import SessionQuestion
from app.llm.rephraser import Rephraser
from app.llm.scorer import Scorer
from app.llm.follow_up import FollowUpGenerator
from app.callback.retry import RetryCallbackClient
from app.session.result_builder import build_finish_payload

logger = logging.getLogger(__name__)

CORRECTNESS_WEIGHT = 0.6
COMPLETENESS_WEIGHT = 0.4

def _clamp_score(value: int) -> int:
    return max(0, min(100, value))

def _compute_accuracy(correctness: int, completeness: int) -> int:
    correctness = _clamp_score(correctness)
    completeness = _clamp_score(completeness)
    return _clamp_score(int(round(
        correctness * CORRECTNESS_WEIGHT + completeness * COMPLETENESS_WEIGHT
    )))

class SessionHandler:
    def __init__(
        self,
        manager:         SessionManager,
        rephraser:       Rephraser,
        scorer:          Scorer,
        follow_up:       FollowUpGenerator,
        callback:        RetryCallbackClient,
    ):
        self._manager   = manager
        self._rephraser = rephraser
        self._scorer    = scorer
        self._follow_up = follow_up
        self._callback  = callback

    async def handle(self, websocket, path=None):
        state = await self._manager.get_state()

        if not state:
            logger.error("WebSocket connect rejected: session state is not initialized")
            await websocket.close(1011, "Session not initialized")
            return

        request_path = path or getattr(websocket, "path", "")
        remote = getattr(websocket, "remote_address", None)
        logger.info(
            "WebSocket client connected for session %s path=%s remote=%s",
            state.session_id,
            request_path,
            remote,
        )

        try:
            auth = await asyncio.wait_for(websocket.recv(), timeout=10.0)
            token_msg = json.loads(auth)
            if token_msg.get("token") != state.session_token:
                logger.warning("WebSocket auth failed for session %s: invalid token", state.session_id)
                await websocket.close(1008, "Invalid session token")
                return
        except json.JSONDecodeError:
            logger.warning("WebSocket auth failed for session %s: auth payload is not valid JSON", state.session_id)
            await websocket.close(1008, "Invalid auth payload")
            return
        except asyncio.TimeoutError:
            logger.warning("WebSocket auth timeout for session %s", state.session_id)
            await websocket.close(1008, "Auth timeout")
            return
        except ConnectionClosedError as e:
            logger.warning(
                "WebSocket closed during auth for session %s code=%s reason=%s",
                state.session_id,
                e.code,
                e.reason,
            )
            return

        logger.info("WebSocket auth succeeded for session %s", state.session_id)

        total_questions = len(state.questions)
        await websocket.send(json.dumps({"event": "session_started", "total_questions": total_questions}))

        for idx, question in enumerate(state.questions):
            display_text = (question.rephrased_text or "").strip()
            is_rephrased = bool(display_text)

            if not is_rephrased:
                try:
                    generated = await asyncio.to_thread(self._rephraser.rephrase, question.question_text)
                    generated = (generated or "").strip()
                    if generated:
                        display_text = generated
                        is_rephrased = generated != question.question_text.strip()
                except Exception:
                    logger.exception(
                        "Question rephrase failed: session=%s question_id=%s",
                        state.session_id,
                        question.question_id,
                    )

            if not display_text:
                display_text = question.question_text

            await websocket.send(json.dumps({
                "event":           "question",
                "question_id":     question.question_id,
                "question_text":   display_text,
                "is_weak_topic":   question.is_weak_topic,
                "is_rephrased":    is_rephrased,
                "question_number": idx + 1,
                "total_questions": total_questions,
            }))
            logger.info(
                "Question sent: session=%s question_id=%s number=%s/%s rephrased=%s",
                state.session_id,
                question.question_id,
                idx + 1,
                total_questions,
                is_rephrased,
            )

            start_time = time.time()

            try:
                raw = await asyncio.wait_for(
                    websocket.recv(),
                    timeout=300.0
                )
                msg = json.loads(raw)
                user_answer    = msg.get("answer", "")
                answering_time = int(time.time() - start_time)
                logger.info(
                    "Answer received: session=%s question_id=%s answer_len=%s",
                    state.session_id,
                    question.question_id,
                    len(user_answer),
                )

                correctness, completeness, ai_reply = await asyncio.to_thread(
                    self._scorer.score,
                    display_text,
                    question.answer,
                    user_answer,
                )
                correctness = _clamp_score(correctness)
                completeness = _clamp_score(completeness)
                accuracy = _compute_accuracy(correctness, completeness)
                logger.info(
                    "Answer scored: session=%s question_id=%s accuracy=%s correctness=%s completeness=%s",
                    state.session_id,
                    question.question_id,
                    accuracy,
                    correctness,
                    completeness,
                )

                await self._manager.record_answer(AnswerRecord(
                    question_id=question.question_id,
                    answer_text=user_answer,
                    ai_reply=ai_reply,
                    accuracy=accuracy,
                    correctness=correctness,
                    completeness=completeness,
                    answering_time=answering_time,
                    was_rephrased=is_rephrased,
                    was_weak_topic=question.is_weak_topic,
                ))

                if self._follow_up.should_generate(correctness, completeness):
                    follow_up_q = await asyncio.to_thread(
                        self._follow_up.generate,
                        display_text,
                        question.answer,
                        user_answer,
                        question.category_id,
                        question.difficulty_id,
                        question.tag_ids,
                    )
                    if follow_up_q:
                        await self._manager.record_ai_question(follow_up_q)
                        logger.info(
                            "Follow-up generated: session=%s base_question_id=%s",
                            state.session_id,
                            question.question_id,
                        )

                await websocket.send(json.dumps({
                    "event":        "answer_feedback",
                    "accuracy":     accuracy,
                    "correctness":  correctness,
                    "completeness": completeness,
                    "ai_reply":     ai_reply,
                }))

            except asyncio.TimeoutError:
                logger.warning(
                    "Question timeout: session=%s question_id=%s",
                    state.session_id,
                    question.question_id,
                )
                await websocket.send(json.dumps({
                    "event":   "question_timeout",
                    "message": "Time limit exceeded for this question",
                }))
            except ConnectionClosedError as e:
                logger.warning(
                    "WebSocket closed mid-session: session=%s question_id=%s code=%s reason=%s",
                    state.session_id,
                    question.question_id,
                    e.code,
                    e.reason,
                )
                return
            except ConnectionClosedOK as e:
                logger.info(
                    "WebSocket closed normally mid-session: session=%s question_id=%s code=%s reason=%s",
                    state.session_id,
                    question.question_id,
                    e.code,
                    e.reason,
                )
                return

        await websocket.send(json.dumps({"event": "session_finished"}))
        logger.info("Session finished event sent: session=%s", state.session_id)
        await self._manager.mark_finished()

        state = await self._manager.get_state()
        payload = build_finish_payload(state)
        callback_ok = await asyncio.to_thread(self._callback.finish, state.session_token, payload)
        logger.info("Finish callback result: session=%s success=%s", state.session_id, callback_ok)
