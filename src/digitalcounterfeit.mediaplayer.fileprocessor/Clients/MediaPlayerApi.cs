using digitalcounterfeit.mediaplayer.fileprocessor.Clients.Interfaces;
using digitalcounterfeit.mediaplayer.models;

namespace digitalcounterfeit.mediaplayer.fileprocessor.Clients
{
    public class MediaPlayerApi : ApiClientBase, IMediaPlayerApi
    {
        protected override HttpClient Client { get; }
        protected override string AccessToken { get; }


        public MediaPlayerApi(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {

            Client = httpClientFactory.CreateClient();
            AccessToken = configuration.GetValue<string>("AccessToken");
            Client.BaseAddress = new Uri(configuration.GetValue<string>("MediaPlayerApiUri"));
        }


        public async Task<LibraryModel> GetLibraryByUserIdAsync(Guid userId)
        {
            return await GetAsync<LibraryModel>($"api/library/user/{userId}");
        }


        public async Task<IEnumerable<ArtistModel>> GetLibraryArtistListAsync(Guid libraryId)
        {
            return await GetAsync<IEnumerable<ArtistModel>>($"api/library/{libraryId}/artist-list");
        }

        public async Task<IEnumerable<AlbumModel>> GetArtistAlbumListAsync(Guid artistId)
        {
            return await GetAsync<IEnumerable<AlbumModel>>($"api/artist/{artistId}/album-list");
        }

        public async Task<IEnumerable<AudioTrackModel>> GetAlbumAudioTrackList(Guid albumId)
        {
            return await GetAsync<IEnumerable<AudioTrackModel>>($"api/album/{albumId}/audio-track-list");
        }


        public async Task UpsertArtistAsync(ArtistModel artist)
        {
            await PutAsync("api/artist", artist);
        }

        public async Task UpsertAlbumAsync(AlbumModel album)
        {
            await PutAsync("api/album", album);
        }

        public async Task UpsertAudioTrackAsync(AudioTrackModel audioTrack)
        {
            await PutAsync("api/audio-track", audioTrack);
        }
    }
}
