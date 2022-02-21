using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using digitalcounterfeit.mediaplayer.services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Web.Mvc;

namespace digitalcounterfeit.mediaplayer.services
{
    public class AzureImageStorage : IAzureImageStorage
    {
        private const string CONTAINER_NAME = "images";
        private readonly string _accountName;
        private readonly string _accountKey;
        private readonly StorageSharedKeyCredential _credential;
        private readonly BlobContainerClient _container;
        private MemoryCache _uriCache;
        private readonly ILogger<AzureImageStorage> _logger;

        public AzureImageStorage(ILogger<AzureImageStorage> logger, IConfiguration configuration)
        {
            _accountName = configuration.GetValue<string>("AzureBlobAccountName");
            _accountKey = configuration.GetValue<string>("AzureBlobAccountKey");
            _credential = new StorageSharedKeyCredential(_accountName, _accountKey);
            _container = new BlobContainerClient(new Uri($"https://{_accountName}.blob.core.windows.net/{CONTAINER_NAME}"), _credential);
            _uriCache = new MemoryCache(new MemoryCacheOptions());
            _logger = logger;
        }

        public async Task DeleteImageAsync(string blobName)
        {
            var blob = _container.GetBlobClient(blobName);

            await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
        }

        public async Task<FileStreamResult> DownloadImageAsync(string blobName)
        {
            var blob = _container.GetBlobClient(blobName);

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

        public async Task<string> GetImageSasUriAsync(string blobName)
        {
            if (_uriCache.TryGetValue<string>(blobName, out var cachedUri))
            {
                return cachedUri;
            }
            else
            {
                var (sasUri, expiresOn) = await GenerateSasUriAsync(blobName);

                if (sasUri != default)
                    _uriCache.Set(blobName, sasUri, expiresOn);

                return sasUri;
            }
        }

        public async Task UploadImageAsync(Stream stream, string blobName, string contentType)
        {
            var blob = _container.GetBlockBlobClient(blobName);

            using (stream)
            {
                await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType }, accessTier: AccessTier.Hot);
            }
        }


        private async Task<(string, DateTimeOffset)> GenerateSasUriAsync(string blobName)
        {
            var expiresOn = DateTimeOffset.UtcNow.AddHours(1);
            var key = new StorageSharedKeyCredential(_accountName, _accountKey);
            var container = new BlobContainerClient(new Uri($"https://{_accountName}.blob.core.windows.net/{CONTAINER_NAME}"), key);            
            var blob = container.GetBlockBlobClient(blobName);

            try
            {
                if (await blob.ExistsAsync())
                {
                    var sasBuilder = new BlobSasBuilder(BlobContainerSasPermissions.Read, expiresOn)
                    {
                        BlobName = blobName,
                        BlobContainerName = container.Name,
                        Resource = "b",
                        StartsOn = DateTimeOffset.UtcNow
                    };                    

                    var builder = new UriBuilder(blob.Uri)
                    {
                        Query = sasBuilder.ToSasQueryParameters(key).ToString()
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
