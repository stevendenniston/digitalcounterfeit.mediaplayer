using System;

namespace digitalcounterfeit.mediaplayer.api.Models
{
    public class AlbumModel
    {
        public Guid Id { get; set; }        
        public Guid ArtistId { get; set; }
        public string Name { get; set; }
    }
}
