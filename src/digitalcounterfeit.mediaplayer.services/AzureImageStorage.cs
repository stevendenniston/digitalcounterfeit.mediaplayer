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
    public class AzureImageStorage : IAzureImageStorage
    {
        private const string CONTAINER_NAME = "images";        
        private readonly StorageSharedKeyCredential _credential;
        private readonly BlobContainerClient _container;
        private readonly MemoryCache _uriCache;
        private readonly ILogger<AzureImageStorage> _logger;

        public AzureImageStorage(ILogger<AzureImageStorage> logger, IConfiguration configuration)
        {
            var accountName = configuration.GetValue<string>("AzureBlobAccountName");
            var accountKey = configuration.GetValue<string>("AzureBlobAccountKey");
            _credential = new StorageSharedKeyCredential(accountName, accountKey);
            _container = new BlobContainerClient(new Uri($"https://{accountName}.blob.core.windows.net/{CONTAINER_NAME}"), _credential);
            _uriCache = new MemoryCache(new MemoryCacheOptions());
            _logger = logger;
        }

        public async Task DeleteImageAsync(string blobName)
        {
            var blob = _container.GetBlobClient(blobName);

            await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
        }        

        public async Task<string> GetImageSasUriAsync(string blobName)
        {
            if (_uriCache.TryGetValue<string>(blobName, out var cachedUri))
            {
                return cachedUri;
            }
            else
            {
                var (sasUri, expiresOn) = await GenerateSasUriAsync(blobName);

                if (!string.IsNullOrWhiteSpace(sasUri))
                    _uriCache.Set(blobName, sasUri, expiresOn);

                return sasUri;
            }
        }

        public async Task UploadImageAsync(Stream stream, string blobName, string contentType)
        {
            var blob = _container.GetBlockBlobClient(blobName);
                       
            await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType }, accessTier: AccessTier.Hot);            
        }


        private async Task<(string, DateTimeOffset)> GenerateSasUriAsync(string blobName)
        {
            var expiresOn = DateTimeOffset.UtcNow.AddHours(24);            
            var blob = _container.GetBlockBlobClient(blobName);

            try
            {
                if (await blob.ExistsAsync())
                {
                    var sasBuilder = new BlobSasBuilder(BlobContainerSasPermissions.Read, expiresOn)
                    {
                        BlobName = blobName,
                        BlobContainerName = _container.Name,
                        Resource = "b",
                        StartsOn = DateTimeOffset.UtcNow                        
                    };

                    sasBuilder.SetPermissions(BlobSasPermissions.Read);

                    var builder = new UriBuilder(blob.Uri)
                    {
                        Query = sasBuilder.ToSasQueryParameters(_credential).ToString()
                    };

                    return (builder.ToString(), expiresOn);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting SAS Uri for image.");
            }

            return (string.Empty, default);
        }
    }
}
