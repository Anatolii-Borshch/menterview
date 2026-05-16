import json
from app.llm.client import LlmClient

SYSTEM_PROMPT = (
    "You are a strict technical interviewer. "
    "Given a question, the correct answer, and the candidate's answer, "
    "evaluate the candidate's answer along two dimensions, each from 0 to 100: "
    "correctness (factual accuracy) and completeness (coverage of key points). "
    "Respond ONLY in this exact JSON format with no extra text: "
    '{"correctness": <int>, "completeness": <int>, "feedback": "<string>"}'
)


class Scorer:
    def __init__(self, client: LlmClient):
        self._client = client

    def score(
        self,
        question:       str,
        correct_answer: str,
        user_answer:    str,
    ) -> tuple[int, int, str]:
        """Returns (correctness, completeness, feedback)."""
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
            return (
                int(result["correctness"]),
                int(result["completeness"]),
                str(result["feedback"]),
            )
        except (json.JSONDecodeError, KeyError):
            return 0, 0, raw