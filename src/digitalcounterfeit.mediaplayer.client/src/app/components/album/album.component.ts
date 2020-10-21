import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Album } from 'src/app/models/album';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  selector: "app-album",
  templateUrl: "./album.component.html",
  styleUrls: ["./album.component.scss"]
})
export class AlbumComponent implements OnInit {

  album: Album = new Album();

  constructor(
    private albumService: AlbumService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const albumId = params.get("albumId");
      this.albumService.GetAlbum(albumId)
        .subscribe(album => {
          this.album = album;
        }, error => {
          console.log(error);
        });
    });
  }
}
