import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Album } from 'src/app/models/album';
import { Artist } from "src/app/models/artist";
import { ArtistService } from "src/app/services/artist.service";

@Component({
  selector: "app-artist",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.scss"]
})
export class ArtistComponent implements OnInit {

  artist: Artist = new Artist;
  albumList: Album[];

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const artistId = params.get("artistId");
      this.artistService.GetArtist(artistId)
        .subscribe(artist => {
          this.artist = artist;
        }, error => {
          console.log(error);
        });
      this.artistService.GetAlbumList(artistId)
        .subscribe(albumList => {
          this.albumList = albumList;
        }, error => {
          console.log(error);
        });
    });
  }
}
