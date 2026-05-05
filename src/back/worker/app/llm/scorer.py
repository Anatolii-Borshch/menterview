import json
from app.llm.client import LlmClient

SYSTEM_PROMPT = (
    "You are a strict technical interviewer. "
    "Given a question, the correct answer, and the candidate's answer, "
    "score the candidate's answer from 0 to 100. "
    "Respond ONLY in this exact JSON format with no extra text: "
    '{\"score\": <int>, \"feedback\": \"<string>\"}'
)

class Scorer:
    def __init__(self, client: LlmClient):
        self._client = client

    def score(
        self,
        question:       str,
        correct_answer: str,
        user_answer:    str,
    ) -> tuple[int, str]:
        user_prompt = (
            f"Question: {question}\n"
            f"Correct answer: {correct_answer}\n"
            f"Candidate answer: {user_answer}"
        )
        raw = self._client.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
        try:
            result = json.loads(raw)
            return int(result["score"]), str(result["feedback"])
        except (json.JSONDecodeError, KeyError):
            # Fallback if model returns malformed JSON
            return 0, raw