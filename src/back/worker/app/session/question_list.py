from dataclasses import dataclass

@dataclass
class SessionQuestion:
    question_id:    int
    question_text:  str
    answer:         str
    category_id:    int
    difficulty_id:  int
    is_weak_topic:  bool
    rephrased_text: str

def parse_questions(raw: list[dict]) -> list[SessionQuestion]:
    return [
        SessionQuestion(
            question_id=q["question_id"],
            question_text=q["question_text"],
            answer=q["answer"],
            category_id=q["category_id"],
            difficulty_id=q["difficulty_id"],
            is_weak_topic=q.get("is_weak_topic", False),
            rephrased_text=q.get("rephrased_text", ""),
        )
        for q in raw
    ]