namespace Menterview.Application.Dtos.Answers;

public class SubmittedAnswerDto
{
    public long QuestionId { get; set; }
    public string AnswerText { get; set; } = null!;
    public string AiReply { get; set; } = null!;
    public int Correctness { get; set; }
    public int Completeness { get; set; }
    public int Accuracy { get; set; }
    public int AnsweringTime { get; set; }
    public bool WasRephrased { get; set; }
    public bool WasWeakTopicReview { get; set; }
}