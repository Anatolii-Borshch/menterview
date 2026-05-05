from app.llm.client import LlmClient

SYSTEM_PROMPT = (
    "You are an interview coach. Rephrase the given technical interview "
    "question. Keep exactly the same concept but use different wording. "
    "Return only the rephrased question, nothing else."
)

class Rephraser:
    def __init__(self, client: LlmClient):
        self._client = client

    def rephrase(self, question_text: str) -> str:
        return self._client.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=question_text,
        )