using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Admin;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Services;

public class SystemStatusService : ISystemStatusService
{
    private readonly MenterviewDbContext _db;

    public SystemStatusService(MenterviewDbContext db)
    {
        _db = db;
    }

    public async Task<SystemStatusDto> GetSystemStatusAsync(CancellationToken ct = default)
    {
        var status = new SystemStatusDto
        {
            CheckedAt = DateTime.UtcNow,
            Api = new ApiHealthDto
            {
                IsHealthy = true,
                Status = "Online"
            }
        };

        try
        {
            var canConnect = await _db.Database.CanConnectAsync(ct);
            var userCount = await _db.Users.CountAsync(ct);
            var sessionCount = await _db.SessionStories.CountAsync(ct);
            var questionCount = await _db.Questions.CountAsync(ct);

            status.Database = new DatabaseHealthDto
            {
                IsConnected = canConnect,
                Status = canConnect ? "Connected" : "Disconnected",
                UserCount = userCount,
                SessionCount = sessionCount,
                QuestionCount = questionCount
            };
        }
        catch (Exception ex)
        {
            status.Database = new DatabaseHealthDto
            {
                IsConnected = false,
                Status = "Failed",
                Error = ex.Message
            };
        }

        try
        {
            status.Workers = new WorkerHealthDto
            {
                IsHealthy = true,
                Status = "Online",
                ActiveWorkers = 0,
                MaxWorkers = 0
            };

            status.Manager = new ManagerHealthDto
            {
                IsHealthy = true,
                Status = "Online"
            };
        }
        catch (Exception ex)
        {
            status.Workers = new WorkerHealthDto
            {
                IsHealthy = false,
                Status = "Offline",
                Error = ex.Message
            };

            status.Manager = new ManagerHealthDto
            {
                IsHealthy = false,
                Status = "Offline",
                Error = ex.Message
            };
        }

        return status;
    }
}
