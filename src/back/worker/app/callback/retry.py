import time
import logging
from app.callback.client import CallbackClient

logger = logging.getLogger(__name__)

class RetryCallbackClient:
    def __init__(self, client: CallbackClient, max_retries: int = 5):
        self._client      = client
        self._max_retries = max_retries

    def finish(self, session_token: str, payload: dict) -> bool:
        session_id = payload.get("session_id", "unknown")
        delay = 2
        for attempt in range(self._max_retries):
            try:
                success = self._client.finish(session_token, payload)
                if success:
                    logger.info(
                        "Finish callback succeeded: session=%s attempt=%s",
                        session_id,
                        attempt + 1,
                    )
                    return True
                logger.warning(
                    "Finish callback returned failure: session=%s attempt=%s",
                    session_id,
                    attempt + 1,
                )
            except Exception as exc:
                logger.exception(
                    "Finish callback raised: session=%s attempt=%s",
                    session_id,
                    attempt + 1,
                )
            time.sleep(delay)
            delay *= 2
        logger.error("All finish callback attempts failed: session=%s", session_id)
        return False