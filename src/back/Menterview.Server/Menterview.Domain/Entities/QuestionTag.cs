namespace Menterview.Domain.Entities
{
    public class QuestionTag
    {
        public long QuestionTagId { get; set; }
        
        public long QuestionId { get; set; }
        public Question Question { get; set; } = null!;
        
        public int TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}