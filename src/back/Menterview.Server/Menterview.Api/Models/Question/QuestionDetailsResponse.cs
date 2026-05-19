namespace Menterview.Api.Models.Question;

public class QuestionDetailsResponse : QuestionListItemResponse
{
    public string Answer { get; set; } = null!;
}