using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Models;
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

        public AlbumController(IAlbumRepository albumRepository)
        {
            _albumRepository = albumRepository;
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
