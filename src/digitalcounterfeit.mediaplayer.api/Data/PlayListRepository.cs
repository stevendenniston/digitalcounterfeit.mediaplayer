using Dapper;
using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data
{
    public class PlayListRepository : IPlayListRepository
    {
        private readonly string _connectionString;

        public PlayListRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[PlayList_DeleteById]",
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<PlayListModel> GetByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                using (var multi = await connection
                                        .QueryMultipleAsync(
                                            "[dbo].[PlayList_GetById]",
                                            new { Id = id },
                                            commandType: CommandType.StoredProcedure))
                {
                    var playList = (await multi.ReadAsync<PlayListModel>()).FirstOrDefault();
                    playList.TrackList = await multi.ReadAsync<AudioTrackModel>();
                    return playList;
                }
            }
        }

        public async Task UpsertAsync(PlayListModel playList)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var audioTrackIdList = new DataTable();
                audioTrackIdList.Columns.Add("Id", typeof(Guid));
                audioTrackIdList.Rows.Add(playList.TrackList?.Select(track => track.Id));

                await connection
                    .ExecuteAsync(
                        "[dbo].[PlayList_Upsert]", 
                        new 
                        {
                            Id = playList.Id,
                            LibraryId = playList.LibraryId,
                            Name = playList.Name,
                            AudioTrackIdList = audioTrackIdList
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }
    }
}
