using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.extensions;
using digitalcounterfeit.mediaplayer.models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers.v1
{
    [ApiController]
    [Route("api/library")]
    public class LibraryController : ControllerBase
    {
        private readonly IIdentityRepository _identityRepository;
        private readonly ILibraryRepository _libraryRepository;

        public LibraryController(ILibraryRepository libraryRepository, IIdentityRepository identityRepository)
        {
            _identityRepository = identityRepository;
            _libraryRepository = libraryRepository;
        }        

        [HttpGet]
        public async Task<ActionResult<LibraryModel>> GetByUserSubjectIdAsync()
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);

            if (identity == null)
            {
                identity = new IdentityModel { Id = Guid.NewGuid(), SubjectId = subjectId };
                await _identityRepository.UpsertAsync(identity);
            }

            var library = await _libraryRepository.GetByUserIdAsync(identity.Id);

            if (library == null)
                return NotFound();

            return Ok(library);
        }

        [HttpPut]
        public async Task<IActionResult> UpsertAsync([FromBody] LibraryModel library)
        {
            var subjectId = User?.GetUserSubjectId();
            var identity = await _identityRepository.GetBySubjectIdAsync(subjectId);

            if (identity != null)
            {
                library.UserId = identity.Id;

                await _libraryRepository.UpsertAsync(library);

                return NoContent();
            }

            return StatusCode(418);
        }

        [HttpPatch]
        public async Task<IActionResult> PatchAsync([FromQuery] Guid id, [FromBody] JsonPatchDocument<LibraryModel> libraryPatch)
        {
            var library = await _libraryRepository.GetByIdAsync(id);

            if (library == null)
                return NotFound();

            libraryPatch.ApplyTo(library);

            await _libraryRepository.UpsertAsync(library);

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteByIdAsync([FromQuery] Guid id)
        {
            await _libraryRepository.DeleteByIdAsync(id);

            return NoContent();
        }
    }
}
