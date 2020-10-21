using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Extensions;
using digitalcounterfeit.mediaplayer.api.Models;
using digitalcounterfeit.mediaplayer.api.Services;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/audio-track")]
    public class AudioTrackController : ControllerBase
    {
        private readonly IAzureAudioStorage _azureAudioStorage;
        private readonly IAudioTrackRepository _audioTrackRepository;

        public AudioTrackController(IAzureAudioStorage azureAudioStorage, IAudioTrackRepository audioTrackRepository)
        {
            _azureAudioStorage = azureAudioStorage;
            _audioTrackRepository = audioTrackRepository;
        }


        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AudioTrackModel>> GetByIdAsync(Guid id)
        {
            var audioTrack = await _audioTrackRepository.GetByIdAsync(id);

            if (audioTrack == null)
                return NotFound();

            return Ok(audioTrack);
        }

        [HttpGet("{id:guid}/stream-uri")]
        public async Task<ActionResult<IEnumerable<string>>> GetAudioTrackSasUriAsync(Guid id)
        {
            var blobName = $@"{User?.GetUserSubjectId()}/{id}";
            var audioTrackUri = await _azureAudioStorage.GetAudioTrackSasUriAsync(blobName);

            if (string.IsNullOrWhiteSpace(audioTrackUri))
                return NotFound();

            return Ok(audioTrackUri);
        }
        
        [HttpGet("/api/album/{albumId:guid}/audio-track-list")]
        public async Task<ActionResult<IEnumerable<AudioTrackModel>>> GetAlbumAudioTrackListAsync(Guid albumId)
        {
            var audioTrackList = await _audioTrackRepository.GetAlbumAudioTrackListAsync(albumId);

            return Ok(audioTrackList);            
        }

        [HttpPut]
        public async Task<IActionResult> UpsertAsync(AudioTrackModel audioTrack)
        {
            await _audioTrackRepository.UpsertAsync(audioTrack);

            return NoContent();
        }

        [HttpPut("{id:guid}/file")]
        public async Task<IActionResult> PutAudioTrackAsync(Guid id)
        {
            if (Request.ContentLength <= 0)
                return BadRequest("Empty request body; Cannot upload an empty audio file...");

            var blobName = $@"{User?.GetUserSubjectId()}/{id}";

            await _azureAudioStorage.UploadAudioTrackAsync(Request.Body, blobName, Request.ContentType);
            return NoContent();
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PatchAsync(Guid id, JsonPatchDocument<AudioTrackModel> audioTrackPatch)
        {
            var audioTrack = await _audioTrackRepository.GetByIdAsync(id);

            if (audioTrack == null)
                return NotFound();

            audioTrackPatch.ApplyTo(audioTrack);

            await _audioTrackRepository.UpsertAsync(audioTrack);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteByIdAsync(Guid id)
        {
            await _audioTrackRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}