﻿using Dapper;
using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly string _connectionString;

        public AlbumRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public async Task DeleteByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[Album_DeleteById]",
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<IEnumerable<AlbumModel>> GetArtistAlbumListAsync(Guid artistId)
        {
            using(var connection = new SqlConnection(_connectionString))
            {
                return await connection
                    .QueryAsync<AlbumModel>(
                        "[dbo].[Album_GetListByArtistId]", 
                        new 
                        {
                            ArtistId = artistId
                        }, 
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<AlbumModel> GetByArtistIdAlbumName(Guid artistId, string name)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection
                    .QueryFirstOrDefaultAsync<AlbumModel>(
                        "[dbo].[Album_GetByArtistIdAlbumName]", 
                        new 
                        { 
                            ArtistId = artistId,
                            AlbumName = name
                        }, 
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<AlbumModel> GetByIdAsync(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection
                    .QueryFirstOrDefaultAsync<AlbumModel>(
                        "[dbo].[Album_GetById]",
                        new
                        {
                            Id = id
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }

        public async Task UpsertAsync(AlbumModel album)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection
                    .ExecuteAsync(
                        "[dbo].[Album_Upsert]",
                        new
                        {
                            Id = album.Id,
                            LibraryId = album.LibraryId,
                            ArtistId = album.ArtistId,
                            Name = album.Name,
                            Year = album.Year
                        },
                        commandType: CommandType.StoredProcedure);
            }
        }
    }
}
