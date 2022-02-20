using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.extensions;
using digitalcounterfeit.mediaplayer.models;
using digitalcounterfeit.mediaplayer.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/album")]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumRepository _albumRepository;
        private readonly IAzureImageStorage _imageStorage;
        private readonly IIdentityRepository _identityRepository;

        public AlbumController(IAlbumRepository albumRepository, IAzureImageStorage imageStorage, IIdentityRepository identityRepository)
        {
            _albumRepository = albumRepository;
            _imageStorage = imageStorage;
            _identityRepository = identityRepository;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AlbumModel>> GetByIdAsync(Guid id)
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);

            if (identity != null)
            {
                var album = await _albumRepository.GetByIdAsync(id);

                if (album == null)
                    return NotFound();

                album.ImageUri = await _imageStorage.GetImageSasUriAsync($@"{identity.Id}/{album.ArtistId}/{album.Id}");

                return Ok(album);
            }

            return StatusCode(418);
        }

        [HttpGet("/api/artist/{artistId:guid}/album-list")]
        public async Task<ActionResult<IEnumerable<AlbumModel>>> GetArtistAlbumListAsync(Guid artistId)
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);
            var albumList = await _albumRepository.GetArtistAlbumListAsync(artistId);
            var result = new List<AlbumModel>();

            if (identity != null && albumList.Any())
            {
                foreach (var album in albumList)
                    result.Add(
                        new AlbumModel 
                        {
                            ArtistId = album.ArtistId,
                            Id = album.Id,
                            ImageUri = await _imageStorage.GetImageSasUriAsync($@"{identity.Id}/{album.ArtistId}/{album.Id}"),
                            LibraryId = album.LibraryId,
                            Name = album.Name,
                            Year = album.Year
                        });
            }

            return Ok(result);
        }

        [HttpGet("/api/artist/{artistId:guid}/album")]
        public async Task<ActionResult<AlbumModel>> GetByArtistIdAlbumNameAsync(Guid artistId, [FromQuery] string name)
        {
            var album = await _albumRepository.GetByArtistIdAlbumName(artistId, name);

            if (album == null)
                return NotFound();

            return Ok(album);
        }

        [HttpGet("/api/artist/{artistId:guid}/album/{albumId:guid}/image-uri")]
        public async Task<ActionResult<IEnumerable<string>>> GetAlbumImageSasUriAsync(Guid artistId, Guid albumId)
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);

            if (identity != null)
            {
                var blobName = $@"{identity.Id}/{artistId}/{albumId}";
                var audioTrackUri = await _imageStorage.GetImageSasUriAsync(blobName);

                if (string.IsNullOrWhiteSpace(audioTrackUri))
                    return NotFound();

                return Ok(audioTrackUri);
            }

            return StatusCode(418);            
        }


        [HttpPut("/api/artist/{artistId:guid}/album/{albumId:guid}/image")]
        public async Task<IActionResult> UpsertAlbumImageAsync(Guid artistId, Guid albumId, IFormFile file)
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);

            if (identity != null)
            {
                if (Request.ContentLength <= 0)
                    return BadRequest("Empty request body; Cannot upload an empty image file...");

                var blobName = $@"{identity.Id}/{artistId}/{albumId}";
                await _imageStorage.UploadImageAsync(file.OpenReadStream(), blobName, file.ContentType);

                return NoContent();
            }

            return StatusCode(418);            
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
