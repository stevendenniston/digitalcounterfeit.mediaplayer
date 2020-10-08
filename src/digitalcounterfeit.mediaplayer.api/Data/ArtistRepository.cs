using Dapper;
using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data
{
    public class ArtistRepository : IArtistRepository
    {
        private readonly string _connectionString;

        public ArtistRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[Artist_DeleteById]",
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<ArtistModel> GetByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection
                    .QueryFirstOrDefaultAsync<ArtistModel>(
                        "[dbo].[Artist_GetById]",
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task UpsertAsync(ArtistModel artist)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[Artist_Upsert]",
                        new 
                        { 
                            Id = artist.Id,
                            LibraryId = artist.LibraryId,
                            Name = artist.Name
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }
    }
}
