namespace Menterview.Application.Dtos.Admin;

public class ManagerHealthDto
{
    public bool IsHealthy { get; set; }
    public string Status { get; set; } = "Unknown";
    public string? Error { get; set; }
}