using Menterview.Domain.Enums;

namespace Menterview.Domain.Entities
{
    public class NewQuestion
    {
        public long SuggestionId { get; set; }
        
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;

        public SuggestionStatus Status { get; set; } = SuggestionStatus.Pending;
        public SuggestionType Type { get; set; } = SuggestionType.New;
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; }

        public Guid? UserId { get; set; }
        public BusinessUser? User { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int DifficultyId { get; set; }
        public Difficulty Difficulty { get; set; } = null!;
        public ICollection<NewQuestionTag> Tags { get; set; } = new List<NewQuestionTag>();
    }
}