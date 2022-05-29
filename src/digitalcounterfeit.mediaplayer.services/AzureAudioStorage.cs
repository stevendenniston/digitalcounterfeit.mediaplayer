using Azure;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using digitalcounterfeit.mediaplayer.services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace digitalcounterfeit.mediaplayer.services
{
    public class AzureAudioStorage : IAzureAudioStorage
    {
        private const string CONTAINER_NAME = "audio";
        private readonly StorageSharedKeyCredential _credential;
        private readonly BlobContainerClient _container;
        private readonly MemoryCache _uriCache;
        private readonly ILogger<AzureAudioStorage> _logger;


        public AzureAudioStorage(ILogger<AzureAudioStorage> logger, IConfiguration configuration)
        {
            var accountName = configuration.GetValue<string>("AzureBlobAccountName");
            var accountKey = configuration.GetValue<string>("AzureBlobAccountKey");
            _credential = new StorageSharedKeyCredential(accountName, accountKey);
            _container = new BlobContainerClient(new Uri($"https://{accountName}.blob.core.windows.net/{CONTAINER_NAME}"), _credential);
            _uriCache = new MemoryCache(new MemoryCacheOptions());
            _logger = logger;
        }


        public async Task DeleteAudioTrackAsync(string blobName)
        {
            var blob = _container.GetBlobClient(blobName);

            await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
        }

        public Task<string> GetAudioTrackSasUriAsync(string blobName)
        {
            if (_uriCache.TryGetValue<string>(blobName, out var cachedUri))
            {
                return Task.FromResult(cachedUri);
            }
            else
            {
                var (sasUri, expiresOn) = GenerateSasUri(blobName);
                _uriCache.Set(blobName, sasUri, expiresOn);
                return Task.FromResult(sasUri);
            }
        }

        public async Task<Response<BlobContentInfo>> UploadAudioTrackAsync(Stream stream, string blobName, string contentType)
        {            
            var blob = _container.GetBlockBlobClient(blobName);
            
            return await blob
                .UploadAsync(
                    stream,
                    new BlobHttpHeaders { ContentType = contentType },
                    accessTier: AccessTier.Hot);
        }


        private (string, DateTimeOffset) GenerateSasUri(string blobName)
        {
            var expiresOn = DateTimeOffset.UtcNow.AddHours(1);            
            var blob = _container.GetBlockBlobClient(blobName);

            var sasBuilder = new BlobSasBuilder()
            {
                BlobName = blobName,
                BlobContainerName = _container.Name,
                Resource = "b",
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = expiresOn
            };

            sasBuilder.SetPermissions(BlobContainerSasPermissions.Read);

            var builder = new UriBuilder(blob.Uri)
            {
                Query = sasBuilder.ToSasQueryParameters(_credential).ToString()
            };

            return (builder.ToString(), expiresOn);
        }
    }
}
