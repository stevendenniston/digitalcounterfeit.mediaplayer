using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Services
{
    public class AzureAudioStorage : IAzureAudioStorage
    {
        private const string CONTAINER_NAME = "audio";
        private readonly string _connectionString;

        public AzureAudioStorage(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("AzureBlobConnectionString");
        }

        public async Task<FileStreamResult> DownloadAudioTrackAsync(string blobName)
        {
            var container = new BlobContainerClient(_connectionString, CONTAINER_NAME);
            var blob = container.GetBlockBlobClient(blobName);

            if (await blob.ExistsAsync())
            {
                var stream = new MemoryStream();
                var download = await blob.DownloadToAsync(stream);
                if (stream.CanSeek)
                {
                    stream.Seek(0, SeekOrigin.Begin);
                    return new FileStreamResult(stream, download.Headers.ContentType);
                }
            }

            return null;
        }

        public async Task UploadAudioTrackAsync(Stream stream, string blobName, string contentType)
        {
            var container = new BlobContainerClient(_connectionString, CONTAINER_NAME);
            var blob = container.GetBlockBlobClient(blobName);

            using (stream)
            {
                await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType }, accessTier: AccessTier.Hot);
            }
        }
    }
}
