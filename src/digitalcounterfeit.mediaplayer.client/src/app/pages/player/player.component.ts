import { Component } from "@angular/core";
import { AudioService } from "../../services/audio.service";
import { CloudService } from "../../services/cloud.service";
import { StreamState } from "../../interfaces/stream-state";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent {

  state: StreamState;
  currentFile: any = {};
  files: Array<any> = [];

  constructor(
    public audioService: AudioService,
    public cloudService: CloudService
  ) {
    this.cloudService.getFiles().subscribe(files => this.files = files);
    this.audioService.getState().subscribe(state => this.state = state);
  }

  playStream(url): void {
    this.audioService.playStream(url).subscribe(events => {console.log(events)});
  }

  isFirstPlaying(): boolean {
    return this.currentFile.index === 0;
  }

  isLastPlaying(): boolean {
    return this.currentFile.index === this.files.length - 1;
  }

  next(): void {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous(): void {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  onSliderChangeEnd(event): void {
    this.audioService.seekTo(event.value)
  }

  pause(): void {
    this.audioService.pause();
  }

  play(): void {
    this.audioService.play();
  }

  stop(): void {
    this.audioService.stop();
  }

  openFile(file, index): void {
    this.currentFile = { file, index };
    this.audioService.stop();
    this.playStream(file.url);
  }

}
