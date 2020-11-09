using Azure;
using Azure.Storage.Blobs.Models;
using System;
using System.IO;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Services
{
    public interface IAzureAudioStorage
    {
        Task<string> GetAudioTrackSasUriAsync(string blobName);
        Task<Response<BlobContentInfo>> UploadAudioTrackAsync(Stream stream, string blobName, string contentType, IProgress<long> progressHandler = null);
    }
}
