using Asp.Versioning;
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

namespace digitalcounterfeit.mediaplayer.api.Controllers.v1
{
    [ApiController]
    [Route("api/v{version:apiVersion}/album")]
    [ApiVersion(1.0)]
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

        [HttpGet]
        public async Task<ActionResult<AlbumModel>> GetByIdAsync([FromQuery] Guid id)
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

        [HttpGet("/api/v{version:apiVersion}/artist/album-list")]
        public async Task<ActionResult<IEnumerable<AlbumModel>>> GetArtistAlbumListAsync([FromQuery] Guid artistId)
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);
            var albumList = await _albumRepository.GetArtistAlbumListAsync(artistId);
            var result = new List<AlbumModel>();

            if (albumList.Any())
            {
                foreach (var album in albumList)
                {
                    var imageUrl = identity != null ? await _imageStorage.GetImageSasUriAsync($@"{identity.Id}/{album.ArtistId}/{album.Id}") : string.Empty;

                    result.Add(
                        new AlbumModel
                        {
                            ArtistId = album.ArtistId,
                            Id = album.Id,
                            ImageUri = imageUrl,
                            LibraryId = album.LibraryId,
                            Name = album.Name,
                            Year = album.Year
                        });
                }
            }

            return Ok(result);
        }

        [HttpGet("/api/v{version:apiVersion}/artist/album")]
        public async Task<ActionResult<AlbumModel>> GetByArtistIdAlbumNameAsync([FromQuery] Guid artistId, [FromQuery] string name)
        {
            var album = await _albumRepository.GetByArtistIdAlbumName(artistId, name);

            if (album == null)
                return NotFound();

            return Ok(album);
        }

        [HttpGet("/api/v{version:apiVersion}/artist/album/image-uri")]
        public async Task<ActionResult<IEnumerable<string>>> GetAlbumImageSasUriAsync([FromQuery] Guid artistId, [FromQuery] Guid albumId)
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


        [HttpPut("/api/v{version:apiVersion}/artist/album/image")]
        public async Task<IActionResult> UpsertAlbumImageAsync([FromQuery] Guid artistId, [FromQuery] Guid albumId, [FromBody] IFormFile file)
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);

            if (identity != null)
            {
                if (Request.ContentLength <= 0)
                    return BadRequest("Empty request body; Cannot upload an empty image file...");

                var blobName = $@"{identity.Id}/{artistId}/{albumId}";

                using var stream = file.OpenReadStream();

                await _imageStorage.UploadImageAsync(stream, blobName, file.ContentType);

                return NoContent();
            }

            return StatusCode(418);
        }

        [HttpPut]
        public async Task<IActionResult> UpsertAsync([FromBody] AlbumModel album)
        {
            await _albumRepository.UpsertAsync(album);

            return NoContent();
        }

        [HttpPatch]
        public async Task<IActionResult> PatchAsync([FromQuery] Guid id, [FromBody] JsonPatchDocument<AlbumModel> albumPatch)
        {
            var album = await _albumRepository.GetByIdAsync(id);

            if (album == null)
                return NotFound();

            albumPatch.ApplyTo(album);

            await _albumRepository.UpsertAsync(album);

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteByIdAsync([FromQuery] Guid id)
        {
            await _albumRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}
