using Menterview.Application.Dtos.Answers;

namespace Menterview.Application.Dtos.Session;

public class FinishSessionCommand
{
    public long SessionId { get; set; }
    public IEnumerable<SubmittedAnswerDto> Answers { get; set; } = [];
    public int TotalTime { get; set; }
    public IEnumerable<AiGeneratedQuestionCommand> AiGeneratedQuestions { get; set; } = [];
}

public class AiGeneratedQuestionCommand
{
    public string QuestionText { get; set; } = null!;
    public string Answer { get; set; } = null!;
    public int CategoryId { get; set; }
    public int DifficultyId { get; set; }
    public IEnumerable<int> TagIds { get; set; } = [];
}
