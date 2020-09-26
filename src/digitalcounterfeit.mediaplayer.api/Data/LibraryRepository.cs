using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data
{
    public class LibraryRepository : ILibraryRepository
    {
        public Task DeleteByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<LibraryModel> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task UpsertAsync(LibraryModel library)
        {
            throw new NotImplementedException();
        }
    }
}
