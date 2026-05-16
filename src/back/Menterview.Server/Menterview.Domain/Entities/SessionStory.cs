using Menterview.Domain.Enums;

namespace Menterview.Domain.Entities
{
    public class SessionStory
    {
        public long SessionId { get; set; }
        
        public int AnsweredCount { get; set; }
        public int TotalTime { get; set; }
        public int QuestionsAmount { get; set; }

        public DateTime Time { get; set; }
        public DateTime? CompletedAt { get; set; }

        public SessionStatus Status { get; set; } = SessionStatus.Pending;
        public float Score { get; set; }

        public Guid UserId { get; set; }
        public BusinessUser BusinessUser { get; set; } = null!;

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
        
        public int? DifficultyId { get; set; }
        public Difficulty? Difficulty { get; set; }

        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
        public ICollection<SessionFollowUpQuestion> FollowUpQuestions { get; set; } = new List<SessionFollowUpQuestion>();
    }
}