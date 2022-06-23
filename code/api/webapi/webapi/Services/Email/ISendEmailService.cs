using Azure.Storage.Blobs;
using System.IO;
using System.Threading.Tasks;
using System;

namespace webapi.Services
{
    public interface ISendEmailService
    {
        Task<Uri> UploadFileBlobAsync(string blobContainerName, Stream content, string contentType, string fileName);
    }
}