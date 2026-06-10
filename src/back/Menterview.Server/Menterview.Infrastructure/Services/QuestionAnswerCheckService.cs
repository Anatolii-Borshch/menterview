using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Question;
using Microsoft.Extensions.Configuration;

namespace Menterview.Infrastructure.Services;

public sealed class QuestionAnswerCheckService : IQuestionAnswerCheckService
{
    private const double CorrectnessWeight = 0.6;
    private const double CompletenessWeight = 0.4;

    private const string SystemPrompt =
        "You are a strict technical interviewer. Given a question, the correct answer, and the candidate's answer, evaluate candidate answer from 0 to 100 for correctness and completeness. Respond ONLY with strict JSON in this format: {\"correctness\": <int>, \"completeness\": <int>, \"feedback\": \"<string>\"}.";

    private readonly HttpClient _httpClient;
    private readonly string _model;

    public QuestionAnswerCheckService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        var baseUrl = configuration["RephraseAi:BaseUrl"] ?? configuration["Ollama:Host"] ?? "http://menterview.ollama:11434";
        _model = configuration["RephraseAi:Model"] ?? configuration["Ollama:Model"] ?? "llama3.2";

        _httpClient.BaseAddress = new Uri(baseUrl.TrimEnd('/') + "/");
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<AnswerCheckResultDto> CheckAsync(string questionText, string expectedAnswer, string userAnswer, CancellationToken ct = default)
    {
        var userPrompt = $"Question: {questionText}\nCorrect answer: {expectedAnswer}\nCandidate answer: {userAnswer}";
        var raw = await ChatAsync(_model, userPrompt, ct);

        if (raw.IsModelNotFound)
        {
            var fallbackModel = await GetFirstInstalledModelAsync(ct);
            if (!string.IsNullOrWhiteSpace(fallbackModel))
            {
                raw = await ChatAsync(fallbackModel, userPrompt, ct);
            }
        }

        if (!raw.IsSuccess)
        {
            throw new InvalidOperationException(raw.ErrorMessage ?? "Answer check failed.");
        }

        return ParseScorePayload(raw.Content ?? string.Empty);
    }

    private async Task<ChatResult> ChatAsync(string model, string userPrompt, CancellationToken ct)
    {
        var body = new
        {
            model,
            stream = false,
            messages = new[]
            {
                new { role = "system", content = SystemPrompt },
                new { role = "user", content = userPrompt }
            }
        };

        var requestJson = JsonSerializer.Serialize(body);
        using var content = new StringContent(requestJson, Encoding.UTF8, "application/json");
        using var response = await _httpClient.PostAsync("api/chat", content, ct);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            var isModelNotFound = response.StatusCode == HttpStatusCode.NotFound
                                  && errorBody.Contains("model", StringComparison.OrdinalIgnoreCase)
                                  && errorBody.Contains("not found", StringComparison.OrdinalIgnoreCase);

            return ChatResult.Failure(
                isModelNotFound,
                $"Answer check AI request failed: {(int)response.StatusCode} {response.ReasonPhrase}. {errorBody}");
        }

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: ct);

        if (!document.RootElement.TryGetProperty("message", out var message) ||
            !message.TryGetProperty("content", out var contentValue))
        {
            return ChatResult.Failure(false, "Answer check AI returned unexpected payload.");
        }

        var text = contentValue.GetString()?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(text))
        {
            return ChatResult.Failure(false, "Answer check AI returned empty content.");
        }

        return ChatResult.Success(text);
    }

    private async Task<string?> GetFirstInstalledModelAsync(CancellationToken ct)
    {
        using var response = await _httpClient.GetAsync("api/tags", ct);
        if (!response.IsSuccessStatusCode)
            return null;

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: ct);

        if (!document.RootElement.TryGetProperty("models", out var models) || models.ValueKind != JsonValueKind.Array)
            return null;

        foreach (var model in models.EnumerateArray())
        {
            if (!model.TryGetProperty("name", out var nameElement))
                continue;

            var name = nameElement.GetString();
            if (!string.IsNullOrWhiteSpace(name))
                return name;
        }

        return null;
    }

    private static AnswerCheckResultDto ParseScorePayload(string raw)
    {
        try
        {
            using var document = JsonDocument.Parse(raw);
            var root = document.RootElement;

            var correctness = Clamp(ExtractInt(root, "correctness"));
            var completeness = Clamp(ExtractInt(root, "completeness"));
            var accuracy = ComputeAccuracy(correctness, completeness);

            var feedback = root.TryGetProperty("feedback", out var feedbackElement)
                ? feedbackElement.GetString() ?? string.Empty
                : string.Empty;

            return new AnswerCheckResultDto
            {
                Correctness = correctness,
                Completeness = completeness,
                Accuracy = accuracy,
                AiReply = feedback
            };
        }
        catch
        {
            return new AnswerCheckResultDto
            {
                Correctness = 0,
                Completeness = 0,
                Accuracy = 0,
                AiReply = raw
            };
        }
    }

    private static int ExtractInt(JsonElement root, string key)
    {
        if (!root.TryGetProperty(key, out var value))
            return 0;

        if (value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out var n))
            return n;

        if (value.ValueKind == JsonValueKind.String && int.TryParse(value.GetString(), out var parsed))
            return parsed;

        return 0;
    }

    private static int Clamp(int value) => Math.Max(0, Math.Min(100, value));

    private static int ComputeAccuracy(int correctness, int completeness)
    {
        var result = correctness * CorrectnessWeight + completeness * CompletenessWeight;
        return Clamp((int)Math.Round(result));
    }

    private sealed class ChatResult
    {
        public bool IsSuccess { get; init; }
        public bool IsModelNotFound { get; init; }
        public string? Content { get; init; }
        public string? ErrorMessage { get; init; }

        public static ChatResult Success(string content) => new()
        {
            IsSuccess = true,
            Content = content
        };

        public static ChatResult Failure(bool isModelNotFound, string errorMessage) => new()
        {
            IsSuccess = false,
            IsModelNotFound = isModelNotFound,
            ErrorMessage = errorMessage
        };
    }
}
