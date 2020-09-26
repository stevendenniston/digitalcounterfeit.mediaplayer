using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface IPlayListRepository
    {
        Task<PlayListModel> GetByIdAsync(Guid id);
        Task UpsertAsync(PlayListModel playList);
        Task DeleteByIdAsync(Guid id);
    }
}
