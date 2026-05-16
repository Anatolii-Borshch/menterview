import json
from app.llm.client import LlmClient

SYSTEM_PROMPT = (
    "You are a technical interviewer generating a follow-up question to probe the "
    "candidate's understanding further. The candidate's previous answer was weak. "
    "Create ONE targeted follow-up question that addresses their gap. "
    "Respond ONLY in this exact JSON format with no extra text: "
    '{"question_text": "<string>", "answer": "<string>"}'
)

# Thresholds for triggering follow-up generation
CORRECTNESS_THRESHOLD  = 60
COMPLETENESS_THRESHOLD = 65


class FollowUpGenerator:
    def __init__(self, client: LlmClient):
        self._client = client

    def should_generate(self, correctness: int, completeness: int) -> bool:
        return correctness < CORRECTNESS_THRESHOLD or completeness < COMPLETENESS_THRESHOLD

    def generate(
        self,
        question_text:  str,
        correct_answer: str,
        user_answer:    str,
        category_id:    int,
        difficulty_id:  int,
    ) -> dict | None:
        """
        Returns a dict matching AiGeneratedQuestionDto shape, or None on failure.
        """
        user_prompt = (
            f"Original question: {question_text}\n"
            f"Correct answer: {correct_answer}\n"
            f"Candidate's answer: {user_answer}\n"
            "Generate a follow-up question to address the candidate's knowledge gap."
        )
        raw = self._client.chat(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
        try:
            result = json.loads(raw)
            return {
                "questionText": result["question_text"],
                "answer":       result["answer"],
                "categoryId":   category_id,
                "difficultyId": difficulty_id,
                "tagIds":       [],
            }
        except (json.JSONDecodeError, KeyError):
            print(f"FollowUpGenerator: failed to parse LLM response: {raw!r}")
            return None
