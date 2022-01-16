using digitalcounterfeit.mediaplayer.models;

namespace digitalcounterfeit.mediaplayer.fileprocessor.Clients.Interfaces
{
    public interface IMediaPlayerApi
    {
        Task<LibraryModel> GetLibraryByUserIdAsync(Guid userId);
        Task<IEnumerable<ArtistModel>> GetLibraryArtistListAsync(Guid libraryId);
        Task<IEnumerable<AlbumModel>> GetArtistAlbumListAsync(Guid artistId);
        Task<IEnumerable<AudioTrackModel>> GetAlbumAudioTrackList(Guid albumId);
        Task UpsertArtistAsync(ArtistModel artist);
        Task UpsertAlbumAsync(AlbumModel album);
        Task UpsertAudioTrackAsync(AudioTrackModel audioTrack);
    }
}
