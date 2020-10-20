import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  private librarySubscription: Subscription;

  artistList: Observable<Artist[]>;
  library: Observable<Library>;  

  constructor(
    private artistService: ArtistService,
    private libraryService: LibraryService
  ) { }

  ngOnInit(): void {
    this.artistList = this.artistService.ArtistList;
    this.library = this.libraryService.Library;

    this.librarySubscription = this.library
      .subscribe(library => {
        if (library.id) {
          this.artistService.GetLibraryArtistList(library.id);
        }
      });

    this.libraryService.GetLibrary();
  }

  ngOnDestroy() {
    this.librarySubscription.unsubscribe();
  }
}
