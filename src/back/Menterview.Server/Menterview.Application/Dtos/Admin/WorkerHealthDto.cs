namespace Menterview.Application.Dtos.Admin;

public class WorkerHealthDto
{
    public bool IsHealthy { get; set; }
    public string Status { get; set; } = "Unknown";
    public int ActiveWorkers { get; set; }
    public int MaxWorkers { get; set; }
    public string? Error { get; set; }
}