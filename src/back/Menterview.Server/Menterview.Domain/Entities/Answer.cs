namespace Menterview.Domain.Entities
{
    public class Answer
    {
        public long AnswerId { get; set; }
        
        public string AnswerText { get; set; } = null!;
        public string AiReply { get; set; } = null!;

        // Final composite score (0-100): 0.6*Correctness + 0.4*Completeness
        public int Accuracy { get; set; }

        // Component scores stored separately for detailed analytics
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