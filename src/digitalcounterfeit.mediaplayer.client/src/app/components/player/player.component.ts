import { Component } from "@angular/core";
import { AudioService } from "../../services/audio.service";
import { StreamState } from "../../interfaces/stream-state";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "src/app/app-settings.service";
import { Playlist } from 'src/app/models/play-list';
import { AudioTrack } from 'src/app/models/audio-track';
import { Observable } from 'rxjs';

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent {

  state: StreamState;
  trackList: AudioTrack[];
  currentTrack: AudioTrack;
  playlist: Observable<Playlist>;

  constructor(
    private audioService: AudioService    
  ) {
    this.audioService.getState().subscribe(state => this.state = state);
    this.playlist = this.audioService.Playlist
    this.playlist.subscribe(playlist => {
      this.trackList = playlist.trackList;
    }, error => {
      console.log(error);
    });
  }

  

  isFirstPlaying(): boolean {
    return this.trackList?.findIndex(track => track.id === this.currentTrack?.id) === 0;
  }

  isLastPlaying(): boolean {
    return this.trackList?.findIndex(track => track.id === this.currentTrack?.id) === this.trackList?.length - 1;
  }

  next(): void {
    this.audioService.pause();
    const index = this.trackList?.findIndex(track => track.id === this.currentTrack?.id) + 1;
    this.currentTrack = this.trackList[index];
    this.audioService
      .play(this.currentTrack)
      .then(events => 
        events.subscribe(event => 
          console.log(event)
        ));
  }

  previous(): void {
    this.audioService.pause();
    const index = this.trackList?.findIndex(track => track.id === this.currentTrack?.id) - 1;    
    this.currentTrack = this.trackList[index];
    this.audioService
      .play(this.currentTrack)
      .then(events => 
        events.subscribe(event => 
          console.log(event)
        ));
  }

  onSliderChangeEnd(event): void {
    this.audioService.seekTo(event.value);
  }

  pause(): void {
    this.audioService.pause();
  }

  play(): void {
    if (!this.currentTrack){
      this.currentTrack = this.trackList[0];
      this.audioService
      .play(this.currentTrack)
      .then(events => 
        events.subscribe(event => 
          console.log(event)
        ));
    } else {
      this.audioService.continue();
    }    
  }

  stop(): void {
    this.audioService.stop();
  }

  openFile(track: AudioTrack): void {
    this.currentTrack = track;
    this.audioService.stop();    
  }
}
