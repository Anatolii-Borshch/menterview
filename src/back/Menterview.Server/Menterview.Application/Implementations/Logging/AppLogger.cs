using Menterview.Application.Contracts.Loggining;
using Microsoft.Extensions.Logging;

namespace Menterview.Application.Implementations.Logging;

public class AppLogger<T> : IAppLogger<T>
{
    private readonly ILogger<T> _logger;

    public AppLogger(ILogger<T> logger) => _logger = logger;

    public void LogInformation(string message, params object[] args) =>
        _logger.LogInformation(message, args);

    public void LogWarning(string message, params object[] args) =>
        _logger.LogWarning(message, args);

    public void LogError(string message, params object[] args) =>
        _logger.LogError(message, args);
}