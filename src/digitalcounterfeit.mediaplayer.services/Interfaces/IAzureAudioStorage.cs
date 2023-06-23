using Azure;
using Azure.Storage.Blobs.Models;

namespace digitalcounterfeit.mediaplayer.services.Interfaces
{
    public interface IAzureAudioStorage
    {
        Task<string?> GetAudioTrackSasUriAsync(string blobName);
        Task<Response<BlobContentInfo>> UploadAudioTrackAsync(Stream stream, string blobName, string contentType);
        Task DeleteAudioTrackAsync(string blobName);
    }
}
