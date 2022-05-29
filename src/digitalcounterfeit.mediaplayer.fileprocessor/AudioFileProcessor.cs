
namespace digitalcounterfeit.mediaplayer.fileprocessor
{
    using digitalcounterfeit.mediaplayer.fileprocessor.Clients.Interfaces;
    using digitalcounterfeit.mediaplayer.models;
    using digitalcounterfeit.mediaplayer.services.Interfaces;
    using System.Linq;
    using TagLib;

    public class AudioFileProcessor : BackgroundService
    {
        private readonly ILogger<AudioFileProcessor> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMediaPlayerApi _mediaPlayerApi;
        private readonly IAzureAudioStorage _azureAudioStorage;
        private readonly IAzureImageStorage _azureImageStorage;

        public AudioFileProcessor(
            ILogger<AudioFileProcessor> logger, 
            IConfiguration configuration,
            IMediaPlayerApi mediaPlayerApi,
            IAzureAudioStorage azureAudioStorage,
            IAzureImageStorage azureImageStorage)
        {
            _configuration = configuration;
            _logger = logger;
            _mediaPlayerApi = mediaPlayerApi;
            _azureAudioStorage = azureAudioStorage;
            _azureImageStorage = azureImageStorage;
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
            try
            {

                var directoryInfo = new DirectoryInfo(directoryLocation);

                var directories = directoryInfo.GetDirectories();

                if (Guid.TryParse(directoryInfo.Name, out var userId))
                {
                    var files = directoryInfo.GetFiles();
                    var library = await _mediaPlayerApi.GetLibraryByUserIdAsync(userId);

                    if (files.Any() && library != null)
                    {
                        await ProcessFiles(files, userId, library);                    
                    }
                }

                if (directories.Any())
                {
                    foreach (var directory in directories)
                    {
                        //recursion: see recursion                    
                        await DoTheThingForTheStuff(directory.FullName);
                        //directory.Delete(true);
                    }
                }

                return;

            } catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing files");
            }
        }

        private async Task ProcessFiles(FileInfo[] files, Guid userId, LibraryModel library)
        {
            var artistList = (await _mediaPlayerApi.GetLibraryArtistListAsync(library.Id)).ToList();
            var artistAlbumList = new Dictionary<Guid, List<AlbumModel>>();
            var albumAudioTrackList = new Dictionary<Guid, List<AudioTrackModel>>();

            foreach (var file in files)
            {
                try
                {
                    //do the stuff for the things
                    var id3 = File.Create(file.FullName, "audio/mp3", ReadStyle.Average);

                    //artist data
                    var artist = artistList.FirstOrDefault(artist => artist.Name.Equals(id3.Tag.FirstAlbumArtist, StringComparison.OrdinalIgnoreCase));

                    if (artist == null)
                    {
                        artist = new ArtistModel { Id = Guid.NewGuid(), LibraryId = library.Id, Name = id3.Tag.FirstAlbumArtist };
                        await _mediaPlayerApi.UpsertArtistAsync(artist);
                        artistList.Add(artist);
                    }

                    //album data
                    var albumList = artistAlbumList.FirstOrDefault(map => map.Key == artist.Id).Value;

                    if (albumList == null)
                    {
                        albumList = (await _mediaPlayerApi.GetArtistAlbumListAsync(artist.Id)).ToList();
                        artistAlbumList.Add(artist.Id, albumList);
                    }
                    
                    var album = albumList.FirstOrDefault(album => album.Name.Equals(id3.Tag.Album, StringComparison.OrdinalIgnoreCase));

                    if (album == null)
                    {
                        album = new AlbumModel { Id = Guid.NewGuid(), ArtistId = artist.Id, LibraryId = library.Id, Name = id3.Tag.Album, Year = $"{id3.Tag.Year}", ImageUri = string.Empty };
                        await _mediaPlayerApi.UpsertAlbumAsync(album);
                        albumList.Add(album);
                    }

                    //audio track data
                    var audioTrackList = albumAudioTrackList.FirstOrDefault(map => map.Key == album.Id).Value;

                    if (audioTrackList == null)
                    {
                        audioTrackList = (await _mediaPlayerApi.GetAlbumAudioTrackList(album.Id)).ToList();
                        albumAudioTrackList.Add(album.Id, audioTrackList);
                    }

                    var audioTrack = audioTrackList.FirstOrDefault(audioTrack => audioTrack.Name.Equals(id3.Tag.Title, StringComparison.OrdinalIgnoreCase));

                    if (audioTrack == null)
                    {
                        audioTrack = new AudioTrackModel { Id = Guid.NewGuid(), Album = album, Artist = artist, Name = id3.Tag.Title, Number = (int) id3.Tag.Track, DiscNumber = (int) id3.Tag.Disc};
                        await _mediaPlayerApi.UpsertAudioTrackAsync(audioTrack);
                        audioTrackList.Add(audioTrack);
                    }

                    //audio track azure album image file
                    var albumCover = id3.Tag.Pictures.FirstOrDefault(picture => picture.Type == PictureType.FrontCover);
                    if (albumCover != null)
                    {
                        var albumBlobName = $@"{userId}/{artist.Id}/{album.Id}";
                        var byteVector = albumCover.Data;

                        using var stream = new MemoryStream(byteVector.Data);

                        await _azureImageStorage.UploadImageAsync(stream, albumBlobName, albumCover.MimeType);
                    }

                    //audio track azure blob file
                    var audioBlobName = $@"{userId}/{audioTrack.Id}";
                    using (var fileStream = file.OpenRead())
                    {
                        await _azureAudioStorage.UploadAudioTrackAsync(fileStream, audioBlobName, id3.MimeType);
                    }

                    file.Delete();
                }
                catch(Exception ex)
                {
                    _logger.LogError(ex, $"Error importing audio file for User {userId}");
                    file.Delete();
                }
            }
        }
    }
}