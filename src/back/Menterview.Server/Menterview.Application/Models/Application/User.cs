using Menterview.Domain.Entities;

namespace Menterview.Application.Models.Application;

public class User
{
    public Guid UserId { get; set; }
    
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string EmailAddress { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
        
    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public Setting Setting { get; set; } = null!;
    public ICollection<SessionStory> Sessions { get; set; } = new List<SessionStory>();
    public ICollection<NewQuestion> SuggestedQuestions { get; set; } = new List<NewQuestion>();
}