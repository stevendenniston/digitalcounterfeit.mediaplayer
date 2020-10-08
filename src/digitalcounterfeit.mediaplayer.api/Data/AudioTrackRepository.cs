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
    public class AudioTrackRepository : IAudioTrackRepository
    {
        private readonly string _connectionString;

        public AudioTrackRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[AudioTrack_DeleteById]",
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<AudioTrackModel> GetByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return (await connection
                    .QueryAsync<AudioTrackModel, ArtistModel, AlbumModel, AudioTrackModel>(
                        "[dbo].[AudioTrack_GetById]",
                        (audioTrack, artist, album) =>
                        {
                            audioTrack.Artist = artist;
                            audioTrack.Album = album;
                            return audioTrack;
                        },
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure))
                    .FirstOrDefault();
            }
        }

        public async Task UpsertAsync(AudioTrackModel audioTrack)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[AudioTrack_Upsert]",
                        new
                        {
                            Id = audioTrack.Id,
                            ArtistId = audioTrack.Artist?.Id,
                            AlbumId = audioTrack.Album?.Id,
                            Name = audioTrack.Name,
                            Number = audioTrack.Number,
                            DiscNumber = audioTrack.DiscNumber
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }
    }
}
