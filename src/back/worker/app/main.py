import asyncio
import json
from app.config import Config
from app.session.manager import SessionManager
from app.session.question_list import parse_questions
from app.llm.client import LlmClient
from app.llm.rephraser import Rephraser
from app.llm.scorer import Scorer
from app.llm.follow_up import FollowUpGenerator
from app.callback.client import CallbackClient
from app.callback.retry import RetryCallbackClient
from app.grpc.server import serve_grpc
from app.websocket.server import serve_websocket
from app.websocket.handler import SessionHandler

async def main():
    manager   = SessionManager()
    llm       = LlmClient()
    rephraser = Rephraser(llm)
    scorer    = Scorer(llm)
    follow_up = FollowUpGenerator(llm)
    callback  = RetryCallbackClient(CallbackClient())
    handler   = SessionHandler(manager, rephraser, scorer, follow_up, callback)

    questions = manager.load_from_env()
    await manager.initialize(
        session_id=Config.SESSION_ID,
        session_token=Config.SESSION_TOKEN,
        questions=questions,
    )

    print(f"Worker started — session {Config.SESSION_ID}")
    print(f"Questions loaded: {len(questions)}")

    await asyncio.gather(
        serve_grpc(manager, port=Config.GRPC_PORT),
        serve_websocket(handler, port=Config.WS_PORT),
    )

if __name__ == "__main__":
    asyncio.run(main())