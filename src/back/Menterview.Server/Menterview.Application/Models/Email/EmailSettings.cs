namespace Menterview.Application.Models.Email;

public class EmailSettings
{
    public string SmtpServer { get; set; } = String.Empty;
    public int Port { get; set; }
    public int TimeoutSeconds { get; set; } = 15;
    public string SenderEmail { get; set; } = String.Empty;
    public string SenderPassword { get; set; } = String.Empty;
    public string SenderName { get; set; } = String.Empty;
}