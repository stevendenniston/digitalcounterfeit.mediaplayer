using System;
using System.Collections.Generic;

namespace digitalcounterfeit.mediaplayer.api.Models
{
    public class PlayListModel
    {
        public Guid Id { get; set; }   
        public Guid LibraryId { get; set; }
        public string Name { get; set; }
        public IEnumerable<AudioTrackModel> TrackList { get; set; }
    }
}
