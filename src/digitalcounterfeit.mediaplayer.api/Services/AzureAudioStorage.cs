using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Services
{
    public class AzureAudioStorage : IAzureAudioStorage
    {
        private const string CONTAINER_NAME = "audio";
        private readonly string _accountName;
        private readonly string _accountKey;
        private List<Tuple<string, string, DateTimeOffset>> _uriCache;

        public AzureAudioStorage(IConfiguration configuration)
        {
            _accountName = configuration.GetValue<string>("AzureBlobAccountName");
            _accountKey = configuration.GetValue<string>("AzureBlobAccountKey");
            _uriCache = new List<Tuple<string, string, DateTimeOffset>>();
        }


        public Task<string> GetAudioTrackSasUriAsync(string blobName)
        {
            var cachedUri = _uriCache.FirstOrDefault(uri => uri.Item1.Equals(blobName));

            if (cachedUri == null)
            {                
                var (sasUri, expiresOn) = GenerateSasUri(blobName);

                _uriCache.Add(new Tuple<string, string, DateTimeOffset>(blobName, sasUri, expiresOn));

                return Task.FromResult(sasUri);
            }
            else if (cachedUri.Item3 < DateTimeOffset.UtcNow)
            {                
                var (sasUri, expiresOn) = GenerateSasUri(blobName);

                _uriCache.Remove(cachedUri);
                _uriCache.Add(new Tuple<string, string, DateTimeOffset>(blobName, sasUri, expiresOn));

                return Task.FromResult(sasUri);
            }

            return Task.FromResult(cachedUri.Item2);
        }

        public async Task UploadAudioTrackAsync(Stream stream, string blobName, string contentType)
        {
            var key = new StorageSharedKeyCredential(_accountName, _accountKey);
            var container = new BlobContainerClient(new Uri($"https://{_accountName}.blob.core.windows.net/{CONTAINER_NAME}"), key);
            var blob = container.GetBlockBlobClient(blobName);

            using (stream)
            {
                await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType }, accessTier: AccessTier.Hot);
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
