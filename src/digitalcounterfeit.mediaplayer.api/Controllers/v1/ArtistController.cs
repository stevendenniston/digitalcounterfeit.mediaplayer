using Asp.Versioning;
using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers.v1
{
    [ApiController]
    [Route("api/v{version:apiVersion}/artist")]
    [ApiVersion(1.0)]
    public class ArtistController : ControllerBase
    {
        private readonly IArtistRepository _artistRepository;

        public ArtistController(IArtistRepository artistRepository)
        {
            _artistRepository = artistRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ArtistModel>> GetByIdAsync([FromQuery] Guid id)
        {
            var artist = await _artistRepository.GetByIdAsync(id);

            if (artist == null)
                return NotFound();

            return Ok(artist);
        }

        [HttpGet("/api/v{version:apiVersion}/library/artist-list")]
        public async Task<ActionResult<IEnumerable<ArtistModel>>> GetLibraryArtistListAsync([FromQuery] Guid libraryId)
        {
            var artistList = await _artistRepository.GetLibraryArtistListAsync(libraryId);

            return Ok(artistList.OrderBy(artist => Regex.Replace(artist.Name, @"^(?:the|The)\s*", string.Empty)));
        }


        [HttpPut]
        public async Task<IActionResult> UpsertAsync([FromBody] ArtistModel artist)
        {
            await _artistRepository.UpsertAsync(artist);

            return NoContent();
        }

        [HttpPatch]
        public async Task<IActionResult> PatchAsync([FromQuery] Guid id, [FromBody] JsonPatchDocument<ArtistModel> artistPatch)
        {
            var artist = await _artistRepository.GetByIdAsync(id);

            if (artist == null)
                return NotFound();

            artistPatch.ApplyTo(artist);

            await _artistRepository.UpsertAsync(artist);

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteByIdAsync([FromQuery] Guid id)
        {
            await _artistRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}