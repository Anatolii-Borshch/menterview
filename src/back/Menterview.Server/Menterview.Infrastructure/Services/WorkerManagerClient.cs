using Grpc.Net.Client;
using Manager;
using Menterview.Application.Contracts;
using Menterview.Application.Dtos.Session;

namespace Menterview.Infrastructure.Services;

public class WorkerManagerClient : IWorkerManagerClient
{
    private readonly ManagerService.ManagerServiceClient _grpcClient;

    public WorkerManagerClient(ManagerService.ManagerServiceClient grpcClient)
    {
        _grpcClient = grpcClient;
    }

    public async Task<SpawnWorkerResult> SpawnWorkerAsync(SpawnWorkerCommand command, CancellationToken ct = default)
    {
        var request = new SpawnWorkerRequest
        {
            SessionId = command.SessionId,
            SessionToken = command.SessionToken,
            CallbackAddress = command.CallbackAddress,
            TimeoutSeconds = command.TimeoutSeconds
        };

        foreach (var q in command.Questions)
        {
            request.Questions.Add(new SessionQuestion
            {
                QuestionId = q.QuestionId,
                QuestionText = q.QuestionText,
                Answer = q.Answer ?? string.Empty,
                CategoryId = q.Category?.CategoryId ?? 0,
                DifficultyId = q.Difficulty?.DifficultyId ?? 0,
                IsWeakTopic = q.IsWeakTopicReview,
                RephrasedText = q.RephrasedText ?? string.Empty
            });
        }

        var response = await _grpcClient.SpawnWorkerAsync(request, cancellationToken: ct);

        return new SpawnWorkerResult
        {
            Success = response.Success,
            WorkerGrpcHost = response.WorkerGrpcHost,
            WorkerWsHost = response.WorkerWsHost,
            ContainerId = response.ContainerId,
            ErrorMessage = string.IsNullOrEmpty(response.ErrorMessage) ? null : response.ErrorMessage
        };
    }
}
