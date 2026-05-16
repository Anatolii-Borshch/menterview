using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Repository;
using Menterview.Application.Contracts.Security;
using Menterview.Application.Dtos.Session;
using Menterview.Domain.Entities;
using Menterview.Domain.Enums;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Menterview.Persistence.Services;

public class SessionOrchestrationService : ISessionOrchestrationService
{
    private readonly ISessionRepository _sessionRepo;
    private readonly IQuestionSelectionService _questionSelection;
    private readonly ISessionTokenService _sessionTokenService;
    private readonly IWorkerManagerClient _workerManager;
    private readonly IUserRepository _userRepo;
    private readonly MenterviewDbContext _db;
    private readonly IConfiguration _configuration;

    public SessionOrchestrationService(
        ISessionRepository sessionRepo,
        IQuestionSelectionService questionSelection,
        ISessionTokenService sessionTokenService,
        IWorkerManagerClient workerManager,
        IUserRepository userRepo,
        MenterviewDbContext db,
        IConfiguration configuration)
    {
        _sessionRepo = sessionRepo;
        _questionSelection = questionSelection;
        _sessionTokenService = sessionTokenService;
        _workerManager = workerManager;
        _userRepo = userRepo;
        _db = db;
        _configuration = configuration;
    }

    public async Task<SessionStartedDto> StartSessionAsync(Guid userId, StartSessionCommand command, CancellationToken ct = default)
    {
        var questions = await _questionSelection.SelectQuestionsAsync(
            userId,
            command.CategoryId,
            command.DifficultyId,
            command.TagIds,
            command.QuestionsAmount,
            command.WeakTopicRatio,
            ct);

        var session = new SessionStory
        {
            UserId = userId,
            CategoryId = command.CategoryId,
            DifficultyId = command.DifficultyId,
            QuestionsAmount = questions.Count,
            Status = SessionStatus.Pending,
            Time = DateTime.UtcNow
        };

        session = await _sessionRepo.CreateAsync(session, ct);

        var sessionDurationMinutes = int.TryParse(_configuration["Session:DurationMinutes"], out var d) ? d : 120;
        var expiresAt = DateTime.UtcNow.AddMinutes(sessionDurationMinutes);
        var sessionToken = _sessionTokenService.GenerateSessionToken(session.SessionId, expiresAt);

        var callbackAddress = _configuration["Grpc:CallbackAddress"] ?? "menterview.api:5001";

        session.Status = SessionStatus.WorkerStarting;
        await _sessionRepo.UpdateAsync(session, ct);

        var spawnResult = await _workerManager.SpawnWorkerAsync(new SpawnWorkerCommand
        {
            SessionId = session.SessionId,
            SessionToken = sessionToken,
            CallbackAddress = callbackAddress,
            Questions = questions,
            TimeoutSeconds = sessionDurationMinutes * 60
        }, ct);

        if (!spawnResult.Success)
        {
            session.Status = SessionStatus.Failed;
            await _sessionRepo.UpdateAsync(session, ct);
            throw new InvalidOperationException($"Worker spawn failed: {spawnResult.ErrorMessage}");
        }

        session.Status = SessionStatus.InProgress;
        await _sessionRepo.UpdateAsync(session, ct);

        return new SessionStartedDto
        {
            SessionId = session.SessionId,
            SessionToken = sessionToken,
            WorkerGrpcHost = spawnResult.WorkerGrpcHost,
            WorkerWsHost = spawnResult.WorkerWsHost,
            ExpiresAt = expiresAt
        };
    }

    public async Task FinishSessionAsync(FinishSessionCommand command, CancellationToken ct = default)
    {
        var session = await _db.SessionStories
            .Include(s => s.Answers)
            .FirstOrDefaultAsync(s => s.SessionId == command.SessionId, ct)
            ?? throw new KeyNotFoundException($"Session {command.SessionId} not found.");

        if (session.Status == SessionStatus.Completed)
            return; // idempotent

        // Persist answers
        foreach (var dto in command.Answers)
        {
            if (session.Answers.Any(a => a.QuestionId == dto.QuestionId))
                continue; // idempotent

            var answer = new Answer
            {
                SessionId = command.SessionId,
                QuestionId = dto.QuestionId,
                AnswerText = dto.AnswerText,
                AiReply = dto.AiReply,
                Accuracy = dto.Accuracy,
                AnsweringTime = dto.AnsweringTime,
                WasRephrased = dto.WasRephrased,
                WasWeakTopicReview = dto.WasWeakTopicReview
            };
            _db.Answers.Add(answer);
        }

        // Persist AI-generated follow-up questions
        foreach (var q in command.AiGeneratedQuestions)
        {
            _db.SessionFollowUpQuestions.Add(new SessionFollowUpQuestion
            {
                SessionId = command.SessionId,
                QuestionText = q.QuestionText,
                Answer = q.Answer,
                CategoryId = q.CategoryId,
                DifficultyId = q.DifficultyId
            });
        }

        var answers = command.Answers.ToList();
        var totalAccuracy = answers.Any() ? answers.Average(a => a.Accuracy) : 0;

        session.Status = SessionStatus.Completed;
        session.CompletedAt = DateTime.UtcNow;
        session.AnsweredCount = answers.Count;
        session.TotalTime = command.TotalTime;
        session.Score = (float)totalAccuracy;

        await _db.SaveChangesAsync(ct);

        // Update weak topics for low-accuracy answers
        await UpdateWeakTopicsAsync(session.UserId, answers, ct);
    }

    private async Task UpdateWeakTopicsAsync(Guid userId, List<Application.Dtos.Answers.SubmittedAnswerDto> answers, CancellationToken ct)
    {
        const int weakThreshold = 70;

        var weakAnswers = answers.Where(a => a.Accuracy < weakThreshold).ToList();
        if (!weakAnswers.Count.Equals(0) == false) return;

        var questionIds = weakAnswers.Select(a => a.QuestionId).ToList();
        var questions = await _db.Questions
            .Include(q => q.QuestionTags)
            .Where(q => questionIds.Contains(q.QuestionId))
            .ToListAsync(ct);

        foreach (var answer in weakAnswers)
        {
            var question = questions.FirstOrDefault(q => q.QuestionId == answer.QuestionId);
            if (question == null) continue;

            foreach (var qt in question.QuestionTags)
            {
                var weakTopic = await _db.WeakTopics
                    .FirstOrDefaultAsync(w => w.UserId == userId && w.TagId == qt.TagId && w.OriginalQuestionId == question.QuestionId, ct);

                var score = answer.Accuracy / 100.0f;

                if (weakTopic == null)
                {
                    _db.WeakTopics.Add(new WeakTopic
                    {
                        UserId = userId,
                        TagId = qt.TagId,
                        CategoryId = question.CategoryId,
                        DifficultyId = question.DifficultyId,
                        OriginalQuestionId = question.QuestionId,
                        EaseFactor = 2.5f,
                        RepeatCount = 1,
                        Interval = 1,
                        NextReviewAt = DateTime.UtcNow.AddDays(1)
                    });
                }
                else
                {
                    // SM-2 inspired: update ease factor
                    const float alpha = 0.7f;
                    weakTopic.EaseFactor = alpha * weakTopic.EaseFactor + (1 - alpha) * (score * 2.5f + 1.3f);
                    weakTopic.EaseFactor = Math.Max(1.3f, weakTopic.EaseFactor);
                    weakTopic.RepeatCount++;
                    weakTopic.Interval = (int)Math.Round(weakTopic.Interval * weakTopic.EaseFactor);
                    weakTopic.NextReviewAt = DateTime.UtcNow.AddDays(weakTopic.Interval);
                }
            }
        }

        await _db.SaveChangesAsync(ct);
    }
}
