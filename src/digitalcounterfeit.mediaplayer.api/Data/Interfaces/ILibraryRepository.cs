using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface ILibraryRepository
    {
        Task<LibraryModel> GetByIdAsync(Guid id);
        Task UpsertAsync(LibraryModel library);
        Task DeleteByIdAsync(Guid id);
    }
}
