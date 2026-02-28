using Asp.Versioning;
using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers.v1
{
    [ApiController]
    [Route("api/v{version:apiVersion}/play-list")]
    [ApiVersion(1.0)]
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistRepository _playlistRepository;

        public PlaylistController(IPlaylistRepository playlistRepository)
        {
            _playlistRepository = playlistRepository;
        }

        [HttpGet]
        [Authorize("read:api")]
        public async Task<ActionResult<PlaylistModel>> GetByIdAsync([FromQuery] Guid id)
        {
            var playlist = await _playlistRepository.GetByIdAsync(id);

            if (playlist == null)
                return NotFound();

            return Ok(playlist);
        }

        [HttpPut]
        [Authorize("write:api")]
        public async Task<IActionResult> UpsertAsync([FromBody] PlaylistModel playlist)
        {
            await _playlistRepository.UpsertAsync(playlist);

            return NoContent();
        }

        [HttpPatch]
        [Authorize("write:api")]
        public async Task<IActionResult> PatchAsync([FromQuery] Guid id, [FromBody] JsonPatchDocument<PlaylistModel> playlistPatch)
        {
            var playlist = await _playlistRepository.GetByIdAsync(id);

            if (playlist == null)
                return NotFound();

            playlistPatch.ApplyTo(playlist);

            await _playlistRepository.UpsertAsync(playlist);

            return NoContent();
        }

        [HttpDelete]
        [Authorize("delete:api")]
        public async Task<IActionResult> DeleteByIdAsync([FromQuery] Guid id)
        {
            await _playlistRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}
