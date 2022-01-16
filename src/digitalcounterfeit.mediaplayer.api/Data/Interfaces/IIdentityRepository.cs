using digitalcounterfeit.mediaplayer.models;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface IIdentityRepository
    {
        Task<IdentityModel> GetBySubjectIdAsync(string subjectId);
        Task UpsertAsync(IdentityModel identity);
    }
}
