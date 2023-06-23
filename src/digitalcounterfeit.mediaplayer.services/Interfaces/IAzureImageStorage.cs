namespace digitalcounterfeit.mediaplayer.services.Interfaces
{
    public interface IAzureImageStorage
    {
        Task UploadImageAsync(Stream stream, string blobName, string contentType);        
        Task<string> GetImageSasUriAsync(string blobName);
        Task DeleteImageAsync(string blobName);
    }
}
