namespace Menterview.Api.Models.General;

public class ApiResponse
{
    public bool IsSuccess { get; init; }
    public string[] Errors { get; init; }

    protected ApiResponse(bool isSuccess, string[] errors)
    {
        IsSuccess = isSuccess;
        Errors = errors;
    }

    public static ApiResponse Success()
        => new(true, []);

    public static ApiResponse Failure(params string[] errors)
        => new(false, errors);
}

public class ApiResponse<T> : ApiResponse
{
    public T? Data { get; init; }

    private ApiResponse(T data) : base(true, Array.Empty<string>())
    {
        Data = data;
    }

    private ApiResponse(string[] errors) : base(false, errors)
    {
    }

    public static ApiResponse<T> Success(T data)
        => new(data);

    public new static ApiResponse<T> Failure(params string[] errors)
        => new(errors);
}