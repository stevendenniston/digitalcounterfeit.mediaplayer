import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { StreamState } from "../interfaces/stream-state";
import { Playlist } from "../models/play-list";
import { AudioTrack } from "../models/audio-track";
import { AudioTrackService } from "./audio-track.service";

@Injectable({ providedIn: "root" })
export class AudioService {

  private state: StreamState = {
    isPlaying: false,
    readableCurrentTime: "",
    readableDuration: "",
    duration: undefined,
    currentTime: undefined,
    canPlay: false,
    error: false,
    hasEnded: false
  };

  private stop$ = new Subject();
  private audioObj = new Audio();
  private currentStream: Subscription;
  private stateChange: BehaviorSubject<StreamState>;
  private currentPlaylist: BehaviorSubject<Playlist>;
  private currentAudioTrack: BehaviorSubject<AudioTrack>;

  audioEvents = [
    "ended",
    "error",
    "play",
    "palying",
    "pause",
    "timeupdate",
    "canplay",
    "loadmetadata",
    "loadstart"
  ];

  constructor(private audioTrackService: AudioTrackService) {
    this.stateChange =  new BehaviorSubject(this.state);
    this.currentPlaylist = new BehaviorSubject(new Playlist());
    this.currentAudioTrack = new BehaviorSubject(new AudioTrack());
  }

  get playlist(): Observable<Playlist> {
    return this.currentPlaylist.asObservable();
  }

  get nowPlaying(): Observable<AudioTrack> {
    return this.currentAudioTrack.asObservable();
  }

  get streamState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }


  loadPlaylist(playlist: Playlist): void {
    this.currentPlaylist.next(playlist);
  }

  play(track: AudioTrack): void {
    this.currentStream?.unsubscribe();
    this.currentAudioTrack.next(track);
    this.audioTrackService
    .GetAudioTrackStreamUri(track.id)
    .subscribe(uri => {
      this.currentStream = this.playStream(uri).subscribe();
    });
  }

  continue(): void {
    this.audioObj.play();
  }

  pause(): void {
    this.audioObj.pause();
  }

  stop(): void {
    this.stop$.next();
  }

  seekTo(seconds: number): void {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = "mm:ss"): string {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }


  private playStream(url: any): Observable<unknown> {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canPlay = true;
        this.state.hasEnded = false;
        break;
      case "play":
      case "playing":
        this.state.isPlaying = true;
        this.state.hasEnded = false;
        break;
      case "pause":
        this.state.isPlaying = false;
        this.state.hasEnded = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        this.state.hasEnded = false;
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
      case "ended":
        this.state.hasEnded = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState(): void {
    this.state = {
      isPlaying: false,
      readableCurrentTime: "",
      readableDuration: "",
      duration: undefined,
      currentTime: undefined,
      canPlay: false,
      error: false,
      hasEnded: false
    };
  }

  private streamObservable(url): Observable<unknown> {
    return new Observable(observer => {
      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next();
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);

      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      return () => {
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        this.resetState();
      };
    });
  }

  private addEvents(obj, events, handler): void {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler): void {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }
}
