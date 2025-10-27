using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace ProductApi.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService (IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otp)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Fast Food Delivery", _configuration["Email:From"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "Your OTP Code";
            message.Body = new TextPart("plain")
            {
                Text = $"Welcome to Fast Food Delivery. Your OTP code is: {otp}"
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(_configuration["Email:SmtpServer"], int.Parse(_configuration["Email:Port"]));
            await client.AuthenticateAsync(_configuration["Email:Username"], _configuration["Email:Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }


    }
}
