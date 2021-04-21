using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Services.Interfaces
{
    public interface IAzureImageStorage
    {
        Task UploadImageAsync(Stream stream, string blobName, string contentType);
        Task<FileStreamResult> DownloadImageAsync(string blobName);
        Task<string> GetImageSasUriAsync(string blobName);
        Task DeleteImageAsync(string blobName);
    }
}
