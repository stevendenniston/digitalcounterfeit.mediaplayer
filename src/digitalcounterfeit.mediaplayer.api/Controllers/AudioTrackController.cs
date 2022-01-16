using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.extensions;
using digitalcounterfeit.mediaplayer.models;
using digitalcounterfeit.mediaplayer.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/audio-track")]
    public class AudioTrackController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IAzureAudioStorage _azureAudioStorage;
        private readonly IArtistRepository _artistRepository;
        private readonly IAlbumRepository _albumRepository;
        private readonly IAudioTrackRepository _audioTrackRepository;
        private readonly IIdentityRepository _identityRepository;

        public AudioTrackController(
            IConfiguration configuration,
            IAzureAudioStorage azureAudioStorage, 
            IArtistRepository artistRepository, 
            IAlbumRepository albumRepository, 
            IAudioTrackRepository audioTrackRepository,
            IIdentityRepository identityRepository)
        {
            _configuration = configuration;
            _azureAudioStorage = azureAudioStorage;
            _artistRepository = artistRepository;
            _albumRepository = albumRepository;
            _audioTrackRepository = audioTrackRepository;
            _identityRepository = identityRepository;
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
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);

            if (identity != null)
            {
                var blobName = $@"{identity.Id}/{id}";
                var audioTrackUri = await _azureAudioStorage.GetAudioTrackSasUriAsync(blobName);

                if (string.IsNullOrWhiteSpace(audioTrackUri))
                    return NotFound();

                return Ok(audioTrackUri);
            }

            return StatusCode(418);
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
            await _artistRepository.UpsertAsync(audioTrack.Artist);
            await _albumRepository.UpsertAsync(audioTrack.Album);
            await _audioTrackRepository.UpsertAsync(audioTrack);

            return NoContent();
        }

        [HttpPost("file")]
        public async Task<IActionResult> PutAudioTrackAsync(IFormFile file)
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);

            if (identity != null)
            {
                if (Request.ContentLength <= 0)
                    return BadRequest("Empty request body; Cannot upload an empty audio file...");

                var directoryPath = Path.Combine(_configuration.GetValue<string>("AudioFileLocation"), $"{identity.Id}");

                if (!Directory.Exists(directoryPath))
                    Directory.CreateDirectory(directoryPath);

                using (var fileStream = new FileStream(Path.Combine(directoryPath, file.FileName), FileMode.OpenOrCreate, FileAccess.ReadWrite))
                {
                    await file.OpenReadStream().CopyToAsync(fileStream);
                }                

                return NoContent();
            }

            return StatusCode(418);
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