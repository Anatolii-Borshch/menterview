import requests
from app.config import Config


class CallbackClient:
    """HTTP client that calls the API's FinishSession endpoint."""

    def finish(self, session_token: str, payload: dict) -> bool:
        url = f"http://{Config.CALLBACK_ADDRESS}/api/sessions/finish"
        headers = {
            "Authorization": f"Bearer {session_token}",
            "Content-Type": "application/json",
        }
        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=30)
            if not resp.ok:
                print(f"Callback failed: HTTP {resp.status_code} — {resp.text}")
            return resp.ok
        except requests.RequestException as exc:
            print(f"Callback error: {exc}")
            return False
        return response["message"]["content"].strip()