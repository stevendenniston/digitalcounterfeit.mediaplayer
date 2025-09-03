using System;

namespace digitalcounterfeit.mediaplayer.models
{
    public class AudioTrackModel
    {
        public Guid Id { get; set; }
        public ArtistModel Artist { get; set; }
        public AlbumModel Album { get; set; }
        public string Name { get; set; }
        public int Number { get; set; }
        public int DiscNumber { get; set; }
    }
}
