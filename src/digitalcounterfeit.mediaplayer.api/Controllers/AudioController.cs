using digitalcounterfeit.mediaplayer.api.Extensions;
using digitalcounterfeit.mediaplayer.api.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/audio")]
    public class AudioController : ControllerBase
    {
        private readonly IAzureAudioStorage _azureAudioStorage;
        private string _userId;

        public AudioController(IAzureAudioStorage azureAudioStorage)
        {
            _azureAudioStorage = azureAudioStorage;
            _userId = User?.GetUserSubjectId();
        }

        [HttpGet("track/{id:guid}/uri")]
        public async Task<ActionResult<string>> GetAudioTrackSasUriAsync(Guid id)
        {
            if (string.IsNullOrWhiteSpace(_userId))
                _userId = Request.Headers.FirstOrDefault(header => "X-UserId".Equals(header.Key)).Value;

            var blobName = $@"{_userId}/{id}";
            var audioTrackUri = await _azureAudioStorage.GetAudioTrackSasUriAsync(blobName);

            if (string.IsNullOrWhiteSpace(audioTrackUri))
                return NotFound();

            return Ok(audioTrackUri);
        }

        [HttpPut("track/{id:guid}")]
        public async Task<IActionResult> PutAudioTrackAsync(Guid id)
        {
            if (string.IsNullOrWhiteSpace(_userId))
                _userId = Request.Headers.FirstOrDefault(header => "X-UserId".Equals(header.Key)).Value;

            if (Request.ContentLength <= 0)
                return BadRequest("Empty request body; Cannot upload an empty audio file...");

            var blobName = $@"{_userId}/{id}";
            await _azureAudioStorage.UploadAudioTrackAsync(Request.Body, blobName, Request.ContentType);
            return NoContent();
        }
    }
}