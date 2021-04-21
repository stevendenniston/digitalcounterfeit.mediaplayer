using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Extensions;
using digitalcounterfeit.mediaplayer.api.Models;
using digitalcounterfeit.mediaplayer.api.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/album")]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumRepository _albumRepository;
        private readonly IAzureImageStorage _imageStorage;

        public AlbumController(IAlbumRepository albumRepository, IAzureImageStorage imageStorage)
        {
            _albumRepository = albumRepository;
            _imageStorage = imageStorage;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AlbumModel>> GetByIdAsync(Guid id)
        {
            var album = await _albumRepository.GetByIdAsync(id);

            if (album == null)
                return NotFound();

            return Ok(album);
        }

        [HttpGet("/api/artist/{artistId:guid}/album-list")]
        public async Task<ActionResult<IEnumerable<AlbumModel>>> GetArtistAlbumListAsync(Guid artistId)
        {
            var albumList = await _albumRepository.GetArtistAlbumListAsync(artistId);

            return Ok(albumList);
        }

        [HttpGet("/api/artist/{artistId:guid}/album")]
        public async Task<ActionResult<AlbumModel>> GetByArtistIdAlbumName(Guid artistId, [FromQuery] string name)
        {
            var album = await _albumRepository.GetByArtistIdAlbumName(artistId, name);

            if (album == null)
                return NotFound();

            return Ok(album);
        }

        [HttpGet("/api/artist/{artistId:guid}/album/{albumId:guid}/image-uri")]
        public async Task<ActionResult<IEnumerable<string>>> GetAudioTrackSasUriAsync(Guid artistId, Guid albumId)
        {
            var blobName = $@"{User?.GetUserSubjectId()}/{artistId}/{albumId}";
            var audioTrackUri = await _imageStorage.GetImageSasUriAsync(blobName);

            if (string.IsNullOrWhiteSpace(audioTrackUri))
                return NotFound();

            return Ok(audioTrackUri);
        }


        [HttpPut("/api/artist/{artistId:guid}/album/{albumId:guid}/image")]
        public async Task<IActionResult> UpsertAlbumImage(Guid artistId, Guid albumId, IFormFile file)
        {
            if (Request.ContentLength <= 0)
                return BadRequest("Empty request body; Cannot upload an empty image file...");
            
            var blobName = $@"{User?.GetUserSubjectId()}/{artistId}/{albumId}";
            await _imageStorage.UploadImageAsync(file.OpenReadStream(), blobName, file.ContentType);

            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> UpsertAsync(AlbumModel album)
        {
            await _albumRepository.UpsertAsync(album);

            return NoContent();
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PatchAsync(Guid id, JsonPatchDocument<AlbumModel> albumPatch)
        {
            var album = await _albumRepository.GetByIdAsync(id);

            if (album == null)
                return NotFound();

            albumPatch.ApplyTo(album);

            await _albumRepository.UpsertAsync(album);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteByIdAsync(Guid id)
        {
            await _albumRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}
