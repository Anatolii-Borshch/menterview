namespace Menterview.Domain.Entities
{
    public class NewQuestion
    {
        public long SuggestionId { get; set; }
        
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;

        public long? UserId { get; set; }
        public User? User { get; set; }
    }
}