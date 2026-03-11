namespace Menterview.Domain.Entities
{
    public class SessionStory
    {
        public long SessionId { get; set; }
        
        public int AnsweredCount { get; set; }
        public int TotalTime { get; set; }
        public int QuestionsAmount { get; set; }

        public DateTime Time { get; set; }

        public long UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}