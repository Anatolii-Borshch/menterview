namespace Menterview.Application.Dtos.Question;

public class AnswerCheckResultDto
{
    public int Accuracy { get; set; }
    public int Correctness { get; set; }
    public int Completeness { get; set; }
    public string AiReply { get; set; } = string.Empty;
}
