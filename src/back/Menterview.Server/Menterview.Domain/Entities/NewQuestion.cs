namespace Menterview.Domain.Entities
{
    public class NewQuestion
    {
        public long SuggestionId { get; set; }
        
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;

        public Guid? UserId { get; set; }
        public BusinessUser? User { get; set; }
    }
}