import time
from app.callback.client import CallbackClient


class RetryCallbackClient:
    def __init__(self, client: CallbackClient, max_retries: int = 5):
        self._client      = client
        self._max_retries = max_retries

    def finish(self, session_token: str, payload: dict) -> bool:
        delay = 2
        for attempt in range(self._max_retries):
            try:
                success = self._client.finish(session_token, payload)
                if success:
                    return True
                print(f"Callback attempt {attempt + 1} returned failure")
            except Exception as exc:
                print(f"Callback attempt {attempt + 1} raised: {exc}")
            time.sleep(delay)
            delay *= 2
        print("All callback attempts failed — results may be lost")
        return False