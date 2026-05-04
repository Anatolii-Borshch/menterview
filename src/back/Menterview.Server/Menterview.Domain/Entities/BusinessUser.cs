namespace Menterview.Domain.Entities
{
    public class BusinessUser
    {
        public Guid UserId { get; set; }
        
        public string FirstName { get; set; } = null!;
        public string LasName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        public Setting Setting { get; set; } = null!;

        public bool IsDeleted { get; set; }

        public DateTime DeletedAt { get; set;}

        public ICollection<SessionStory> Sessions { get; set; } = new List<SessionStory>();
        public ICollection<NewQuestion> SuggestedQuestions { get; set; } = new List<NewQuestion>();
    }
}