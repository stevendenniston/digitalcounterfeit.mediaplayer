import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

import { Subscription } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Artist } from "src/app/models/artist";
import { Library } from "src/app/models/library";
import { ArtistService } from "src/app/services/artist.service";
import { LibraryService } from "src/app/services/library.service";

@Component({
  selector: "app-artist-list",
  templateUrl: "./artist-list.component.html",
  styleUrls: ["./artist-list.component.scss"]
})
export class ArtistListComponent implements OnInit, OnDestroy {

  private librarySubscription: Subscription;
  private isAuthenticatedSubscription: Subscription;

  artistList: Observable<Artist[]>;
  library: Observable<Library>;

  constructor(
    private artistService: ArtistService,
    private libraryService: LibraryService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.artistList = this.artistService.ArtistList;
    this.library = this.libraryService.Library;
    
    this.isAuthenticatedSubscription = this.authService.isAuthenticated$
      .subscribe(isAuthenticated => {
        if (isAuthenticated)
          this.libraryService.GetLibrary();        
      });

    this.librarySubscription = this.library
      .subscribe(library => {
        if (library.id) {
          this.artistService.GetLibraryArtistList(library.id);
        }
      });    
  }

  ngOnDestroy(): void {
    this.librarySubscription.unsubscribe();
    this.isAuthenticatedSubscription.unsubscribe();
  }
}
