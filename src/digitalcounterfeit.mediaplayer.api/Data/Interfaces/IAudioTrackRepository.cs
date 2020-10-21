using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface IAudioTrackRepository
    {
        Task<AudioTrackModel> GetByIdAsync(Guid id);
        Task<IEnumerable<AudioTrackModel>> GetAlbumAudioTrackListAsync(Guid albumId);
        Task UpsertAsync(AudioTrackModel audioTrack);
        Task DeleteByIdAsync(Guid id);
    }
}
