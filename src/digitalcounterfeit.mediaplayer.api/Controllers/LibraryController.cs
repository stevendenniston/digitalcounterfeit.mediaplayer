using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Extensions;
using digitalcounterfeit.mediaplayer.api.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/library")]
    public class LibraryController : ControllerBase
    {
        private readonly ILibraryRepository _libraryRepository;

        public LibraryController(ILibraryRepository libraryRepository)
        {
            _libraryRepository = libraryRepository;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<LibraryModel>> GetByIdAsync(Guid id)
        {
            var library = await _libraryRepository.GetByIdAsync(id);

            if (library == null)
                return NotFound();

            return Ok(library);
        }

        [HttpGet("")]
        public async Task<ActionResult<LibraryModel>> GetByUserIdAsync()
        {
            if (Guid.TryParse(User?.GetUserSubjectId(), out var userId))
            {
                var library = await _libraryRepository.GetByUserIdAsync(userId);

                if (library == null)
                    return NotFound();

                return Ok(library);
            }

            return StatusCode(418);
        }

        [HttpPut]
        public async Task<IActionResult> UpsertAsync(LibraryModel library)
        {
            if (Guid.TryParse(User?.GetUserSubjectId(), out var userId))
            {
                library.UserId = userId;

                await _libraryRepository.UpsertAsync(library);

                return NoContent();
            }

            return StatusCode(418);
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PatchAsync(Guid id, JsonPatchDocument<LibraryModel> libraryPatch)
        {
            var library = await _libraryRepository.GetByIdAsync(id);

            if (library == null)
                return NotFound();

            libraryPatch.ApplyTo(library);

            await _libraryRepository.UpsertAsync(library);

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteByIdAsync(Guid id)
        {
            await _libraryRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}
