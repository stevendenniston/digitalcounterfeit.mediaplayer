using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.api.Data
{
    public class AudioTrackRepository : IAudioTrackRepository
    {
        public Task DeleteByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<AudioTrackModel> GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task UpsertAsync(AudioTrackModel audioTrack)
        {
            throw new NotImplementedException();
        }
    }
}
