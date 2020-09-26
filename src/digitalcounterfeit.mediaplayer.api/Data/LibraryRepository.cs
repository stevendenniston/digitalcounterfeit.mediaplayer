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
    public class LibraryRepository : ILibraryRepository
    {
        private readonly string _connectionString;

        public LibraryRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[Library_DeleteById]",
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<LibraryModel> GetByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection
                    .QueryFirstOrDefaultAsync<LibraryModel>(
                        "[dbo].[Library_GetById]", 
                        new 
                        { 
                            Id = id
                        }, 
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task UpsertAsync(LibraryModel library)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[Library_Upsert]", 
                        new 
                        {
                            Id = library.Id,
                            UserId = library.UserId,
                            Name = library.Name
                        }, 
                        commandType: CommandType.StoredProcedure);
            }
        }
    }
}
