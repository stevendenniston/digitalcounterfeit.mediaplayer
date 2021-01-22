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
  private currentStream: Subscription;
  private stateChange: BehaviorSubject<StreamState>;
  private currentPlaylist: BehaviorSubject<Playlist>;
  private currentAudioTrack: BehaviorSubject<AudioTrack>;

  private audioContext: AudioContext;
  private audioElement: HTMLMediaElement;
  private gainNode: GainNode;
  private sixtyHzFilterNode: BiquadFilterNode;
  private fourTenHzFilterNode: BiquadFilterNode;
  private nineTenHzFilterNode: BiquadFilterNode;
  private fourkHzFilterNode: BiquadFilterNode;
  private fourteenkHzFilterNode: BiquadFilterNode;

  // just testing webhooks

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

    this.audioContext = new AudioContext();    
    this.gainNode = new GainNode(this.audioContext, {gain: 1});

    this.sixtyHzFilterNode = new BiquadFilterNode(this.audioContext, {type: "lowshelf", Q: 1, detune: 0, gain: 2.5, frequency: 60});
    this.fourTenHzFilterNode = new BiquadFilterNode(this.audioContext, {type: "peaking", Q: 10, detune: 0, gain: 1.25, frequency: 410});
    this.nineTenHzFilterNode = new BiquadFilterNode(this.audioContext, {type: "peaking", Q: 10, detune: 0, gain: 1.5, frequency: 910});
    this.fourkHzFilterNode = new BiquadFilterNode(this.audioContext, {type: "peaking", Q: 10, detune: 0, gain: 0.25, frequency: 4000});
    this.fourteenkHzFilterNode = new BiquadFilterNode(this.audioContext, {type: "highshelf", Q: 1, detune: 0, gain: 1, frequency: 14000});
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
    this.stop();
    this.audioTrackService
    .GetAudioTrackStreamUri(track.id)
    .subscribe(uri => {
      this.currentStream = this.playStream(uri).subscribe();
    });
  }

  continue(): void {
    this.audioElement.play();
  }

  pause(): void {
    this.audioElement.pause();
  }

  stop(): void {
    this.stop$.next();
  }

  seekTo(seconds: number): void {
    this.audioElement.currentTime = seconds;
  }
  

  private formatTime(time: number, format: string = "mm:ss"): string {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  private playStream(url: any): Observable<unknown> {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioElement.duration;
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
        this.state.currentTime = this.audioElement.currentTime;
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
    return new Observable(subscriber => {
      const handler = (event: Event) => {
        this.updateStateEvents(event);
        subscriber.next();
      };
      
      this.audioElement = new Audio(url);
      this.audioElement.crossOrigin = "";      
      this.audioElement.load();

      this.addEvents(this.audioElement, this.audioEvents, handler);

      const track = this.audioContext.createMediaElementSource(this.audioElement)

      track.connect(this.fourteenkHzFilterNode);
      this.fourteenkHzFilterNode.connect(this.fourkHzFilterNode);
      this.fourkHzFilterNode.connect(this.nineTenHzFilterNode);
      this.nineTenHzFilterNode.connect(this.fourTenHzFilterNode);
      this.fourTenHzFilterNode.connect(this.sixtyHzFilterNode);
      this.sixtyHzFilterNode.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination);
      
      this.audioContext.resume();
      this.audioElement.play();

      return () => {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.removeEvents(this.audioElement, this.audioEvents, handler);
        this.resetState();
        track.disconnect();        
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
