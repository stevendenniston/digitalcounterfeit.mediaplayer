import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { StreamState } from "../interfaces/stream-state";

@Injectable({ providedIn: "root" })
export class AudioService {

  private state: StreamState = {
    playing: false,
    readableCurrentTime: "",
    readableDuration: "",
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false
  };

  private stop$ = new Subject();
  private audioObj = new Audio();
  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);

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

  constructor() { }

  playStream(url: any): Observable<unknown> {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play(): void {
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

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }


  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case "play":
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState(): void {
    this.state = {
      playing: false,
      readableCurrentTime: "",
      readableDuration: "",
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false
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
      // this.audioObj.play();

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
