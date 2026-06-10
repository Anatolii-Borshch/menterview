namespace Menterview.Application.Dtos.Admin;

public class SystemStatusDto
{
    public ApiHealthDto Api { get; set; } = new();
    public DatabaseHealthDto Database { get; set; } = new();
    public WorkerHealthDto Workers { get; set; } = new();
    public ManagerHealthDto Manager { get; set; } = new();
    public DateTime CheckedAt { get; set; }
}
