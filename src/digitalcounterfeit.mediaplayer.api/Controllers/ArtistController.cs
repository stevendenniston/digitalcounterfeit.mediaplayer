using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/artist")]
    public class ArtistController : ControllerBase
    {
        private readonly IArtistRepository _artistRepository;

        public ArtistController(IArtistRepository artistRepository)
        {
            _artistRepository = artistRepository;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ArtistModel>> GetByIdAsync(Guid id)
        {
            var artist = await _artistRepository.GetByIdAsync(id);

            if (artist == null)
                return NotFound();

            return Ok(artist);
        }

        [HttpGet("/api/library/{libraryId:guid}/artist-list")]
        public async Task<ActionResult<IEnumerable<ArtistModel>>> GetLibraryArtistListAsync(Guid libraryId)
        {
            var artistList = await _artistRepository.GetLibraryArtistListAsync(libraryId);

            return Ok(artistList.OrderBy(artist => Regex.Replace(artist.Name, @"^(?:the|The)\s*", string.Empty)));
        }


        [HttpPut]
        public async Task<IActionResult> UpsertAsync(ArtistModel artist)
        {
            await _artistRepository.UpsertAsync(artist);

            return NoContent();
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PatchAsync(Guid id, JsonPatchDocument<ArtistModel> artistPatch)
        {
            var artist = await _artistRepository.GetByIdAsync(id);

            if (artist == null)
                return NotFound();

            artistPatch.ApplyTo(artist);

            await _artistRepository.UpsertAsync(artist);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteByIdAsync(Guid id)
        {
            await _artistRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}