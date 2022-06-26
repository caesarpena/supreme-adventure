using SendGrid;
using SendGrid.Helpers.Mail;

namespace webapi.Services
{
    public class SendEmailService: ISendEmailService
    {
        public SendEmailService()
        {
        }
        //string fromEmail, string emailSubject, string toEmail, string emailplainTextContent, string emailHtmlContent
        public async Task<Response> SendEmailAsync(string password)
        {
            var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json");
            var config = builder.Build();

            string apiKey = config.GetSection("SendGrid:apiKey").Value;

            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("passionfruit69@passionfruit69.com", "Example User");
            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress("cesar_raynell@hotmail.com", "Example User");
            var plainTextContent = "and easy to do anywhere, even with C#" ;
            var htmlContent = "<strong>and easy to do anywhere, even with C# "+password+"</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

            return response;
        }
    }
}