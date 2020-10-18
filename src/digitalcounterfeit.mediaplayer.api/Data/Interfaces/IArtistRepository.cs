using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface IArtistRepository
    {
        Task<ArtistModel> GetByIdAsync(Guid id);
        Task<IEnumerable<ArtistModel>> GetLibraryArtistListAsync(Guid libraryId);
        Task UpsertAsync(ArtistModel artist);
        Task DeleteByIdAsync(Guid id);
    }
}
