using System;
using System.Collections.Generic;

namespace digitalcounterfeit.mediaplayer.api.Models
{
    public class PlaylistModel
    {
        public Guid Id { get; set; }   
        public Guid LibraryId { get; set; }
        public string Name { get; set; }
        public IEnumerable<AudioTrackModel> TrackList { get; set; }
    }
}
