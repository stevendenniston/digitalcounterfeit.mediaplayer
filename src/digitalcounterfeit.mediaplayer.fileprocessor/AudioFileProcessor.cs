
namespace digitalcounterfeit.mediaplayer.fileprocessor
{
    using TagLib;

    public class AudioFileProcessor : BackgroundService
    {
        private readonly ILogger<AudioFileProcessor> _logger;
        private readonly IConfiguration _configuration;

        public AudioFileProcessor(ILogger<AudioFileProcessor> logger, IConfiguration configuration)
        {
            _configuration = configuration;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var audioFileLocation = _configuration.GetValue<string>("AudioFileLocation");

                await DoTheThingForTheStuff(audioFileLocation);                

                await Task.Delay(5000, stoppingToken);
            }
        }

        private async Task DoTheThingForTheStuff(string directoryLocation)
        {
            var directoryInfo = new DirectoryInfo(directoryLocation);

            var files = directoryInfo.GetFiles();
            var directories = directoryInfo.GetDirectories();

            if (files.Any())
            {
                foreach (var file in files)
                {
                    //do the stuff for the things
                    var id3 = File.Create(file.FullName);
                    _logger.LogInformation(id3.Tag.ToString());
                    _logger.LogInformation(file.FullName);
                }
            }

            if (directories.Any())
            {
                foreach (var directory in directories)
                {
                    //recurse?
                    _logger.LogInformation(directory.FullName);
                    await DoTheThingForTheStuff(directory.FullName);
                }
            }

            return;
        }
    }
}