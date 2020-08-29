using digitalcounterfeit.mediaplayer.api.Extensions;
using digitalcounterfeit.mediaplayer.api.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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

        [HttpGet("track/{id:guid}/uri")]
        public async Task<ActionResult<IEnumerable<string>>> GetAudioTrackSasUriAsync(Guid id)
        {
            var blobName = $@"{User?.GetUserSubjectId()}/{id}";
            var audioTrackUri = await _azureAudioStorage.GetAudioTrackSasUriAsync(blobName);

            if (string.IsNullOrWhiteSpace(audioTrackUri))
                return NotFound();

            return Ok(audioTrackUri);
        }
                
        [HttpPut("track/{id:guid}")]
        public async Task<IActionResult> PutAudioTrackAsync(Guid id)
        {
            if (Request.ContentLength <= 0)
                return BadRequest("Empty request body; Cannot upload an empty audio file...");
            
            var blobName = $@"{User?.GetUserSubjectId()}/{id}";

            await _azureAudioStorage.UploadAudioTrackAsync(Request.Body, blobName, Request.ContentType);
            return NoContent();
        }
    }
}