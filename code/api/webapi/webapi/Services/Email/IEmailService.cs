using Azure.Storage.Blobs;
using System.IO;
using System.Threading.Tasks;
using System;
using SendGrid;

namespace webapi.Services
{
    public interface ISendEmailService
    {
        Task<Response> SendEmailAsync(string password);
    }
}