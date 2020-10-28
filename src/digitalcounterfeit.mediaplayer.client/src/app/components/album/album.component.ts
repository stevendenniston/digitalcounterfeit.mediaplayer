import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Album } from 'src/app/models/album';
import { AudioTrack } from 'src/app/models/audio-track';
import { AlbumService } from 'src/app/services/album.service';
import { AudioTrackService } from 'src/app/services/audio-track.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: "app-album",
  templateUrl: "./album.component.html",
  styleUrls: ["./album.component.scss"]
})
export class AlbumComponent implements OnInit {

  album: Album = new Album();
  audioTrackList: AudioTrack[] = [];
  columns: string[] = ['number', 'name']

  constructor(
    private albumService: AlbumService,
    private audioTrackService: AudioTrackService,
    private audioService: AudioService,
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
      this.audioTrackService.GetAlbumAudioTrackList(albumId)
        .subscribe(audioTrackList => {
          this.audioTrackList = audioTrackList;          
        }, error => {
          console.log(error);
        })
    });
  }

  playAlbum(startingTrack: AudioTrack) {
    this.audioService.loadPlaylist({ id: "", libraryId: "", name: "", trackList: this.audioTrackList });
    this.audioService.play(startingTrack);
  }
}
