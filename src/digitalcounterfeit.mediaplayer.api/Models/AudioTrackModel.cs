using System;

namespace digitalcounterfeit.mediaplayer.api.Models
{
    public class AudioTrackModel
    {
        public Guid Id { get; set; }
        public Guid ArtistId { get; set; }
        public Guid AlbumId { get; set; }
        public string Name { get; set; }
        public int Number { get; set; }
        public int DiscNumber { get; set; }
    }
}
