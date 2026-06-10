import ollama
from app.config import Config

class LlmClient:
    def __init__(self):
        self._client = ollama.Client(host=Config.OLLAMA_HOST)
        self._model  = Config.OLLAMA_MODEL

    def chat(self, system_prompt: str, user_prompt: str) -> str:
        response = self._client.chat(
            model=self._model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ]
        )
        return response["message"]["content"].strip()