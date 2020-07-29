using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Controllers
{
    [ApiController]
    [Route("api/audio")]
    public class AudioController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AudioController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("track")]
        public async Task<IActionResult> GetAudioTrackAsync()
        {
            await Task.Yield();

            var fileStream = new FileStream(_configuration.GetValue<string>("AudioFilename"), FileMode.Open);

            return new FileStreamResult(fileStream, "audio/mpeg");
        }
    }
}
