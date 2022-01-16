namespace digitalcounterfeit.mediaplayer.models
{
    public class AlbumModel
    {
        public Guid Id { get; set; }
        public Guid LibraryId { get; set; }
        public Guid ArtistId { get; set; }
        public string Name { get; set; }
        public string ImageUri { get; set; }
        public string Year { get; set; }
    }
}
