using System;

namespace digitalcounterfeit.mediaplayer.api.Models
{
    public class LibraryModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; }
    }
}
