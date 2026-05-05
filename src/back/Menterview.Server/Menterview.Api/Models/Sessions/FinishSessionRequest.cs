using Menterview.Api.Models.Question;
using Menterview.Application.Dtos.Answers;

namespace Menterview.Api.Models.Sessions;

public class FinishSessionRequest
{
    public long SessionId { get; set; }
    public IEnumerable<SubmittedAnswerDto> Answers { get; set; } = [];
    public int TotalTime { get; set; }
    public IEnumerable<AiGeneratedQuestionDto> AiGeneratedQuestions { get; set; } = [];
}