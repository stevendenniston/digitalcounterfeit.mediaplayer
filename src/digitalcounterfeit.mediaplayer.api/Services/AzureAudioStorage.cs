using Azure;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using digitalcounterfeit.mediaplayer.api.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Services
{
    public class AzureAudioStorage : IAzureAudioStorage
    {
        private const string CONTAINER_NAME = "audio";
        private readonly string _accountName;
        private readonly string _accountKey;
        private MemoryCache _uriCache;

        public AzureAudioStorage(IConfiguration configuration)
        {
            _accountName = configuration.GetValue<string>("AzureBlobAccountName");
            _accountKey = configuration.GetValue<string>("AzureBlobAccountKey");
            _uriCache = new MemoryCache(new MemoryCacheOptions());
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

        public async Task<Response<BlobContentInfo>> UploadAudioTrackAsync(Stream stream, string blobName, string contentType, IProgress<long> progressHandler)
        {
            var key = new StorageSharedKeyCredential(_accountName, _accountKey);
            var container = new BlobContainerClient(new Uri($"https://{_accountName}.blob.core.windows.net/{CONTAINER_NAME}"), key);
            var blob = container.GetBlockBlobClient(blobName);
            
            using (stream)
            {
                return await blob
                    .UploadAsync(
                        stream, 
                        new BlobHttpHeaders { ContentType = contentType }, 
                        accessTier: AccessTier.Hot, 
                        progressHandler: progressHandler);
            }
        }


        private (string, DateTimeOffset) GenerateSasUri(string blobName)
        {
            var expiresOn = DateTimeOffset.UtcNow.AddHours(1);
            var key = new StorageSharedKeyCredential(_accountName, _accountKey);
            var container = new BlobContainerClient(new Uri($"https://{_accountName}.blob.core.windows.net/{CONTAINER_NAME}"), key);
            var blob = container.GetBlockBlobClient(blobName);

            var sasBuilder = new BlobSasBuilder()
            {
                BlobName = blobName,
                BlobContainerName = container.Name,
                Resource = "b",
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = expiresOn
            };

            sasBuilder.SetPermissions(BlobContainerSasPermissions.Read);

            var builder = new UriBuilder(blob.Uri)
            {
                Query = sasBuilder.ToSasQueryParameters(key).ToString()
            };

            return (builder.ToString(), expiresOn);
        }
    }
}
