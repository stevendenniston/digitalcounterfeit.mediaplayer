using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using digitalcounterfeit.mediaplayer.api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Services
{
    public class AzureImageStorage : IAzureImageStorage
    {
        private const string CONTAINER_NAME = "images";
        private readonly string _accountName;
        private readonly string _accountKey;
        private readonly StorageSharedKeyCredential _credential;
        private readonly BlobContainerClient _container;        

        public AzureImageStorage(IConfiguration configuration)
        {
            _accountName = configuration.GetValue<string>("AzureBlobAccountName");
            _accountKey = configuration.GetValue<string>("AzureBlobAccountKey");
            _credential = new StorageSharedKeyCredential(_accountName, _accountKey);
            _container = new BlobContainerClient(new Uri($"https://{_accountName}.blob.core.windows.net/{CONTAINER_NAME}"), _credential);            
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

        public async Task UploadImageAsync(Stream stream, string blobName, string contentType)
        {            
            var blob = _container.GetBlockBlobClient(blobName);

            using (stream)
            {                
                await blob.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType }, accessTier: AccessTier.Hot);
            }
        }
    }
}
