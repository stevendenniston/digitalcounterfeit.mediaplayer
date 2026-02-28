import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Album } from "src/app/models/album";
import { Artist } from "src/app/models/artist";
import { AlbumService } from "src/app/services/album.service";
import { ArtistService } from "src/app/services/artist.service";

@Component({
  selector: "app-artist",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.scss"]
})
export class ArtistComponent implements OnInit, OnDestroy {

  artist: Artist = new Artist();
  albumList: Album[];
  sub: Subscription;

  constructor(
    private albumService: AlbumService,
    private artistService: ArtistService,
    private route: ActivatedRoute
  ) {
    this.albumList = [];
  }

  ngOnDestroy(): void {
    this.albumService.ClearAlbumList();
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const artistId = params.get("artistId");
      this.artist = this.artistService.GetArtistById(artistId);
      this.sub = this.albumService.AlbumList
        .subscribe(albumList => {
          this.albumList = albumList;
        }, error => {
          console.log(error);
        });
      this.albumService.GetArtistAlbumList(artistId);
    });
  }
}
