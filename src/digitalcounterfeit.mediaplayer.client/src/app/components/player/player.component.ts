import { Component } from "@angular/core";
import { AudioService } from "../../services/audio.service";
import { StreamState } from "../../interfaces/stream-state";
import { Playlist } from 'src/app/models/play-list';
import { AudioTrack } from 'src/app/models/audio-track';
import { Observable } from 'rxjs';
import { LibraryService } from 'src/app/services/library.service';
import { RepeatType } from 'src/app/models/repeat-type';
import { repeatWhen } from 'rxjs/operators';

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent {

  state: StreamState;
  trackList: AudioTrack[];
  currentTrack: AudioTrack;
  repeat: RepeatType = RepeatType.all;

  playlist: Observable<Playlist>;
  nowPlaying: Observable<AudioTrack>;
  streamState: Observable<StreamState>;

  constructor(
    private audioService: AudioService,
    private libraryService: LibraryService
  ) {
    this.libraryService.GetLibrary();
    this.streamState = this.audioService.streamState;
    this.playlist = this.audioService.playlist;
    this.nowPlaying = this.audioService.nowPlaying;

    this.playlist.subscribe(playlist => this.trackList = playlist.trackList);
    this.nowPlaying.subscribe(track => this.currentTrack = track);
    this.streamState.subscribe(state => this.onStateChange(state))
  }

  isFirstPlaying(): boolean {
    return this.repeat === RepeatType.off && this.trackList?.findIndex(track => track.id === this.currentTrack?.id) === 0;
  }

  isLastPlaying(): boolean {
    return this.repeat === RepeatType.off && this.trackList?.findIndex(track => track.id === this.currentTrack?.id) === this.trackList?.length - 1;
  }

  next(): void {
    const index = this.index(1);
    if (index >= 0){
      this.audioService.pause();            
      this.currentTrack = this.trackList[index];
      this.audioService.play(this.currentTrack);
    } else {
      this.audioService.stop();
    }
  }

  previous(): void {
    this.audioService.pause();    
    const index = this.index(-1);
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
    if (state.hasEnded){
      this.next();
    }    
  }

  private index(deviation: number): number {
    const currentIndex = this.trackList?.findIndex(track => track.id === this.currentTrack?.id);
    if (this.repeat === RepeatType.all) {
      return currentIndex + deviation < 0 ? this.trackList.length - 1 : currentIndex === this.trackList.length - 1 && deviation > -1 ? 0 : currentIndex + deviation;
    } else if (this.repeat === RepeatType.current) {
      return currentIndex;
    } else if (this.repeat === RepeatType.off && !this.isLastPlaying()) {
      return currentIndex + deviation;     
    } else {
      return -1;
    }
  }
}
