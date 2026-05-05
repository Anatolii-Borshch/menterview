import time
import grpc
from app.callback.client import CallbackClient

class RetryCallbackClient:
    def __init__(self, client: CallbackClient, max_retries: int = 5):
        self._client      = client
        self._max_retries = max_retries

    def finish_with_retry(self, payload) -> bool:
        delay = 2
        for attempt in range(self._max_retries):
            try:
                success = self._client.finish(payload)
                if success:
                    return True
            except grpc.RpcError as e:
                print(f"Callback attempt {attempt + 1} failed: {e}")
            time.sleep(delay)
            delay *= 2
        print("All callback attempts failed — results may be lost")
        return False