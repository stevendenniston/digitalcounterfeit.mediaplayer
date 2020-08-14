using digitalcounterfeit.mediaplayer.api.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/audio")]
    public class AudioController : ControllerBase
    {
        private readonly IAzureAudioStorage _azureAudioStorage;        

        public AudioController(IAzureAudioStorage azureAudioStorage)
        {
            _azureAudioStorage = azureAudioStorage;            
        }

        [HttpGet("track/{id:guid}")]
        public async Task<IActionResult> GetAudioTrackAsync(Guid id)
        {
            var blobName = $"{id}";            
            var audioTrack = await _azureAudioStorage.DownloadAudioTrackAsync(blobName);

            return audioTrack;
        }

        [HttpPut("track/{id:guid}")]
        public async Task<IActionResult> PutAudioTrackAsync(Guid id)
        {
            if (Request.ContentLength <= 0)
                return BadRequest("Empty request body; Cannot upload an empty audio file...");

            var blobName = $"{id}";
            await _azureAudioStorage.UploadAudioTrackAsync(Request.Body, blobName, Request.ContentType);
            return NoContent();
        }
    }
}