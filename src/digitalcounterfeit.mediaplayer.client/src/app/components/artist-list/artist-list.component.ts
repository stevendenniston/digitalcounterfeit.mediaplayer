import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Artist } from 'src/app/models/artist';
import { Library } from 'src/app/models/library';
import { ArtistService } from 'src/app/services/artist.service';
import { LibraryService } from 'src/app/services/library.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {

  artists: Observable<Artist[]>;
  library: Observable<Library>;

  constructor(
    private artistService: ArtistService,
    private libraryService: LibraryService
  ) { }

  ngOnInit(): void {
    this.artists = this.artistService.Artists;
    this.library = this.libraryService.Library;

    this.library.subscribe(library => {
      if (library.id) {
        this.artistService.GetLibraryArtistList(library.id);
      }
    });

    this.libraryService.GetLibrary();
  }

}
