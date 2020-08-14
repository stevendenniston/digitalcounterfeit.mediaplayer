using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Services
{
    public interface IAzureAudioStorage
    {
        Task<FileStreamResult> DownloadAudioTrackAsync(string blobName);
        Task UploadAudioTrackAsync(Stream stream, string blobName, string contentType);
    }
}
