namespace Menterview.Domain.Entities
{
    public class Question
    {
        public long QuestionId { get; set; }

        public string QuestionText { get; set; } = null!;
        public string Answer { get; set; } = null!;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        public int DifficultyId { get; set; }
        public Difficulty Difficulty { get; set; } = null!;

        public ICollection<QuestionTag> QuestionTags { get; set; } = new List<QuestionTag>();
    }
}