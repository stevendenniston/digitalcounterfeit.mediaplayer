using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface IArtistRepository
    {
        Task<ArtistModel> GetByIdAsync(Guid id);
        Task UpsertAsync(ArtistModel artist);
        Task DeleteByIdAsync(Guid id);
    }
}
