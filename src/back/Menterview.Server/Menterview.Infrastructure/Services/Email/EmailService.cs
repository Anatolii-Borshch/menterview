using System.Net;
using System.Net.Mail;
using Menterview.Application.Contracts.Email;
using Menterview.Application.Models.Email;
using Microsoft.Extensions.Options;

namespace Menterview.Infrastructure.Services.Email;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(EmailMessage email)
    {
        using var client = new SmtpClient(_settings.SmtpServer, _settings.Port)
        {
            Credentials = new NetworkCredential(_settings.SenderEmail, _settings.SenderPassword),
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            Timeout = Math.Max(_settings.TimeoutSeconds, 1) * 1000
        };

        using var message = new MailMessage
        {
            From = new MailAddress(_settings.SenderEmail, _settings.SenderName),
            Subject = email.Subject,
            Body = email.Body,
            IsBodyHtml = email.IsBodyHtml
        };

        message.To.Add(email.To);

        try
        {
            await client.SendMailAsync(message).WaitAsync(TimeSpan.FromSeconds(Math.Max(_settings.TimeoutSeconds, 1)));
        }
        catch (TimeoutException ex)
        {
            throw new InvalidOperationException("Email sending timed out.", ex);
        }
        catch (SmtpException ex)
        {
            throw new InvalidOperationException($"Failed to send email: {ex.Message}", ex);
        }
    }
}