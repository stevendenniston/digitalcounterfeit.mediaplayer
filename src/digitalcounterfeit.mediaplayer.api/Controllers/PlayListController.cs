using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/play-list")]
    public class PlayListController : ControllerBase
    {
        private readonly IPlayListRepository _playListRepository;

        public PlayListController(IPlayListRepository playListRepository)
        {
            _playListRepository = playListRepository;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PlayListModel>> GetByIdAsync(Guid id)
        {
            var playList = await _playListRepository.GetByIdAsync(id);

            if (playList == null)
                return NotFound();

            return Ok(playList);
        }

        [HttpPut]
        public async Task<IActionResult> UpsertAsync(PlayListModel playList)
        {
            await _playListRepository.UpsertAsync(playList);

            return NoContent();
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PatchAsync(Guid id, JsonPatchDocument<PlayListModel> playListPatch)
        {
            var playList = await _playListRepository.GetByIdAsync(id);

            if (playList == null)
                return NotFound();

            playListPatch.ApplyTo(playList);

            await _playListRepository.UpsertAsync(playList);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteByIdAsync(Guid id)
        {
            await _playListRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}
