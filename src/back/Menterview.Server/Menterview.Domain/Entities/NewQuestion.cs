namespace Menterview.Domain.Entities
{
    public class NewQuestion
    {
        public long SuggestionId { get; set; }
        
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;

        public Guid? UserId { get; set; }
        public BusinessUser? User { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int DifficultyId { get; set; }
        public Difficulty Difficulty { get; set; } = null!;
        public ICollection<NewQuestionTag> Tags { get; set; } = new List<NewQuestionTag>();
    }
}