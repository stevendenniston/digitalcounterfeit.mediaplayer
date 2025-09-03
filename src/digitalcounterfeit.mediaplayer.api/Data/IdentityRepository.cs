using Dapper;
using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.models;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data
{
    public class IdentityRepository : IIdentityRepository
    {
        private readonly string _connectionString;

        public IdentityRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public async Task<IdentityModel> GetBySubjectIdAsync(string subjectId)
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection
                .QueryFirstOrDefaultAsync<IdentityModel>(
                    "[map].[Identity_GetBySubjectId]",
                    new { SubjectId = subjectId },
                    commandType: CommandType.StoredProcedure);
        }

        public async Task UpsertAsync(IdentityModel identity)
        {
            using var connection = new SqlConnection(_connectionString);

            await connection
                .ExecuteAsync(
                    "[map].[Identity_Upsert]", 
                    new 
                    { 
                        Id = identity.Id, 
                        SubjectId = identity.SubjectId 
                    }, 
                    commandType: CommandType.StoredProcedure);
        }
    }
}
