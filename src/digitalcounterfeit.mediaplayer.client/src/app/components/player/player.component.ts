import { Component } from "@angular/core";
import { AudioService } from "../../services/audio.service";
import { StreamState } from "../../interfaces/stream-state";
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
  nowPlaying: Observable<AudioTrack>;
  streamState: Observable<StreamState>;

  constructor(
    private audioService: AudioService    
  ) {
    this.streamState = this.audioService.streamState;
    this.playlist = this.audioService.playlist;
    this.nowPlaying = this.audioService.nowPlaying;

    this.playlist.subscribe(playlist => this.trackList = playlist.trackList);
    this.nowPlaying.subscribe(track => this.currentTrack = track);
    this.streamState.subscribe(state => this.onStateChange(state))
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
    this.audioService.play(this.currentTrack);
  }

  previous(): void {
    this.audioService.pause();
    const index = this.trackList?.findIndex(track => track.id === this.currentTrack?.id) - 1;    
    this.currentTrack = this.trackList[index];
    this.audioService.play(this.currentTrack);
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
      this.audioService.play(this.currentTrack);
    } else {
      this.audioService.continue();
    }
  }

  stop(): void {
    this.audioService.stop();
  }  

  private onStateChange(state: StreamState): void {        
    this.state = state;
    if (state.hasEnded && !this.isLastPlaying()){
      this.next();
    }    
  }
}
