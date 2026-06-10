using Menterview.Application.Models.Email;

namespace Menterview.Application.Contracts.Email;

public interface IEmailService
{
    Task SendEmailAsync(EmailMessage email);
}