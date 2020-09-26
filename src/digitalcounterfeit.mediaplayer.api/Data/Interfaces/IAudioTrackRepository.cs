using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data.Interfaces
{
    public interface IAudioTrackRepository
    {
        Task<AudioTrackModel> GetByIdAsync(Guid id);
        Task UpsertAsync(AudioTrackModel audioTrack);
        Task DeleteByIdAsync(Guid id);
    }
}
