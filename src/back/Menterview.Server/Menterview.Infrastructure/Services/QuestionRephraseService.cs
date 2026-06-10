using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Menterview.Application.Contracts.Service;
using Microsoft.Extensions.Configuration;

namespace Menterview.Infrastructure.Services;

public sealed class QuestionRephraseService : IQuestionRephraseService
{
    private const string SystemPrompt = "You are an interview coach. Rephrase the given technical interview question. Keep exactly the same concept but use different wording. Return only the rephrased question, nothing else.";
    private readonly HttpClient _httpClient;
    private readonly string _model;

    public QuestionRephraseService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        var baseUrl = configuration["RephraseAi:BaseUrl"] ?? configuration["Ollama:Host"] ?? "http://menterview.ollama:11434";
        _model = configuration["RephraseAi:Model"] ?? configuration["Ollama:Model"] ?? "llama3.2";

        _httpClient.BaseAddress = new Uri(baseUrl.TrimEnd('/') + "/");
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<string> RephraseAsync(string questionText, CancellationToken ct = default)
    {
        try
        {
            return await SendChatAsync(_model, questionText, ct);
        }
        catch (ModelNotFoundException)
        {
            var fallbackModel = await GetFirstInstalledModelAsync(ct);
            if (string.IsNullOrWhiteSpace(fallbackModel))
            {
                throw new InvalidOperationException(
                    $"Rephrase AI model '{_model}' is not installed and no fallback models were found. " +
                    "Install a model in Ollama (for example: 'ollama pull llama3.2') or set RephraseAi:Model to an installed one.");
            }

            return await SendChatAsync(fallbackModel, questionText, ct);
        }
    }

    private async Task<string> SendChatAsync(string model, string questionText, CancellationToken ct)
    {
        var body = new
        {
            model,
            stream = false,
            messages = new[]
            {
                new { role = "system", content = SystemPrompt },
                new { role = "user", content = questionText }
            }
        };

        var requestJson = JsonSerializer.Serialize(body);
        using var content = new StringContent(requestJson, Encoding.UTF8, "application/json");
        using var response = await _httpClient.PostAsync("api/chat", content, ct);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(ct);
            if (IsModelNotFound(response, error))
                throw new ModelNotFoundException();

            throw new InvalidOperationException($"Rephrase AI request failed: {(int)response.StatusCode} {response.ReasonPhrase}. {error}");
        }

        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: ct);

        if (!document.RootElement.TryGetProperty("message", out var message) ||
            !message.TryGetProperty("content", out var contentValue))
        {
            throw new InvalidOperationException("Rephrase AI returned an unexpected payload.");
        }

        var text = contentValue.GetString()?.Trim();
        if (string.IsNullOrWhiteSpace(text))
            throw new InvalidOperationException("Rephrase AI returned empty content.");

        return text;
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
            if (model.TryGetProperty("name", out var nameElement))
            {
                var name = nameElement.GetString();
                if (!string.IsNullOrWhiteSpace(name))
                    return name;
            }
        }

        return null;
    }

    private static bool IsModelNotFound(HttpResponseMessage response, string body)
        => response.StatusCode == System.Net.HttpStatusCode.NotFound
           && body.Contains("model", StringComparison.OrdinalIgnoreCase)
           && body.Contains("not found", StringComparison.OrdinalIgnoreCase);

    private sealed class ModelNotFoundException : Exception;
}
