namespace Menterview.Application.Dtos.Admin;

public class DatabaseHealthDto
{
    public bool IsConnected { get; set; }
    public string Status { get; set; } = "Unknown";
    public long UserCount { get; set; }
    public long SessionCount { get; set; }
    public long QuestionCount { get; set; }
    public string? Error { get; set; }
}