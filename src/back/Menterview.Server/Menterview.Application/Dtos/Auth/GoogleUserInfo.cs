namespace Menterview.Application.Dtos.Auth;

public class GoogleUserInfo
{
    public string Sub { get; set; } 
    public string Email{ get; set; }  
    public string? FirstName { get; set; }  
    public string? LastName { get; set; } 
}