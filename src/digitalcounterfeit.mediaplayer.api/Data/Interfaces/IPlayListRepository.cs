using digitalcounterfeit.mediaplayer.models;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface IPlaylistRepository
    {
        Task<PlaylistModel> GetByIdAsync(Guid id);
        Task UpsertAsync(PlaylistModel playlist);
        Task DeleteByIdAsync(Guid id);
    }
}
