using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Services
{
    public interface IAzureAudioStorage
    {
        Task<string> GetAudioTrackSasUriAsync(string blobName);
        Task UploadAudioTrackAsync(Stream stream, string blobName, string contentType);
    }
}
