import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings.service';
import { AudioTrack } from '../models/audio-track';

@Injectable({
  providedIn: 'root'
})
export class AudioTrackService {

  constructor(private http: HttpClient) { }

  GetAlbumAudioTrackList(albumId: string): Observable<AudioTrack[]> {
    return this.http.get<AudioTrack[]>(`${AppSettings.mediaPlayerApiUrl}/album/${albumId}/audio-track-list`);
  }
}
