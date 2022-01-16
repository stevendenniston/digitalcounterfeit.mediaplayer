using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/play-list")]
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistRepository _playlistRepository;

        public PlaylistController(IPlaylistRepository playlistRepository)
        {
            _playlistRepository = playlistRepository;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PlaylistModel>> GetByIdAsync(Guid id)
        {
            var playlist = await _playlistRepository.GetByIdAsync(id);

            if (playlist == null)
                return NotFound();

            return Ok(playlist);
        }

        [HttpPut]
        public async Task<IActionResult> UpsertAsync(PlaylistModel playlist)
        {
            await _playlistRepository.UpsertAsync(playlist);

            return NoContent();
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PatchAsync(Guid id, JsonPatchDocument<PlaylistModel> playlistPatch)
        {
            var playlist = await _playlistRepository.GetByIdAsync(id);

            if (playlist == null)
                return NotFound();

            playlistPatch.ApplyTo(playlist);

            await _playlistRepository.UpsertAsync(playlist);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteByIdAsync(Guid id)
        {
            await _playlistRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}
