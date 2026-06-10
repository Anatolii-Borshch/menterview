namespace Menterview.Domain.Entities
{
    public class Answer
    {
        public long AnswerId { get; set; }
        
        public string AnswerText { get; set; } = null!;
        public string AiReply { get; set; } = null!;
        public int Accuracy { get; set; }
        public int? Correctness { get; set; }
        public int? Completeness { get; set; }

        public int AnsweringTime { get; set; }
        
        public long QuestionId { get; set; }
        public Question Question { get; set; } = null!;
        
        public long SessionId { get; set; }
        public SessionStory Session { get; set; } = null!;

        public bool WasRephrased { get; set; }
        public bool WasWeakTopicReview { get; set; }
        
        public string? RephrasedText { get; set; }
    }
}