using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface IAlbumRepository
    {
        Task<AlbumModel> GetByIdAsync(Guid id);
        Task<IEnumerable<AlbumModel>> GetArtistAlbumListAsync(Guid artistId);
        Task UpsertAsync(AlbumModel album);
        Task DeleteByIdAsync(Guid id);
    }
}
