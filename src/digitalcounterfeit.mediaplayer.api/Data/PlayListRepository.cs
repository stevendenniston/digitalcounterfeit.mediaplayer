using Dapper;
using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.models;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly string _connectionString;

        public PlaylistRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[Playlist_DeleteById]",
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<PlaylistModel> GetByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                using (var multi = await connection
                                        .QueryMultipleAsync(
                                            "[dbo].[Playlist_GetById]",
                                            new { Id = id },
                                            commandType: CommandType.StoredProcedure))
                {
                    var playlist = (await multi.ReadAsync<PlaylistModel>()).FirstOrDefault();
                    playlist.TrackList = await multi.ReadAsync<AudioTrackModel>();
                    return playlist;
                }
            }
        }

        public async Task UpsertAsync(PlaylistModel playlist)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var audioTrackIdList = new DataTable();
                audioTrackIdList.Columns.Add("Id", typeof(Guid));
                audioTrackIdList.Rows.Add(playlist.TrackList?.Select(track => track.Id));

                await connection
                    .ExecuteAsync(
                        "[dbo].[Playlist_Upsert]", 
                        new 
                        {
                            Id = playlist.Id,
                            LibraryId = playlist.LibraryId,
                            Name = playlist.Name,
                            AudioTrackIdList = audioTrackIdList
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }
    }
}
