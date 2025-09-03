namespace digitalcounterfeit.mediaplayer.models
{
    public class PlaylistModel
    {
        public Guid Id { get; set; }
        public Guid LibraryId { get; set; }
        public string Name { get; set; }
        public IEnumerable<AudioTrackModel> TrackList { get; set; }
    }
}
