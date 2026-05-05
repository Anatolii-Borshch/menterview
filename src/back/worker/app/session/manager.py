import asyncio
import json
import time
from dataclasses import dataclass, field
from app.config import Config
from app.session.question_list import SessionQuestion, parse_questions

@dataclass
class AnswerRecord:
    question_id:    int
    answer_text:    str
    ai_reply:       str
    accuracy:       int
    answering_time: int
    was_rephrased:  bool
    was_weak_topic: bool

@dataclass
class SessionState:
    session_id:    int
    session_token: str
    questions:     list[SessionQuestion]
    answers:       list[AnswerRecord] = field(default_factory=list)
    started_at:    float              = field(default_factory=time.time)
    is_finished:   bool               = False

class SessionManager:
    def __init__(self):
        self._state: SessionState | None = None
        self._lock = asyncio.Lock()

    async def initialize(
        self,
        session_id:    int,
        session_token: str,
        questions:     list[SessionQuestion],
    ):
        async with self._lock:
            self._state = SessionState(
                session_id=session_id,
                session_token=session_token,
                questions=questions,
            )

    async def get_state(self) -> SessionState | None:
        async with self._lock:
            return self._state

    async def record_answer(self, record: AnswerRecord):
        async with self._lock:
            if self._state:
                self._state.answers.append(record)

    async def mark_finished(self):
        async with self._lock:
            if self._state:
                self._state.is_finished = True

    async def is_initialized(self) -> bool:
        async with self._lock:
            return self._state is not None

    def load_from_env(self) -> list[SessionQuestion]:
        raw = json.loads(Config.QUESTIONS_JSON)
        return parse_questions(raw)