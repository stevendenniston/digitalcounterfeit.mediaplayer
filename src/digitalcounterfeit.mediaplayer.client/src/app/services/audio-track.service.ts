import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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

  GetAudioTrackStreamUri(audioTrackId: string): Observable<string>{
    const headers = new HttpHeaders().set("Content-Type", "text/plain; charset=utf-8");
    return this.http.get(`${AppSettings.mediaPlayerApiUrl}/audio-track/${audioTrackId}/stream-uri`, { headers, responseType: "text" });
  }

  UploadAudioTrackFiles(files: Set<File>): { [key: string]: { progress: Observable<number> } } {
    const status: { [key: string]: { progress: Observable<number> } } = {};
    
    files.forEach(file => {
      const formData: FormData = new FormData();
      const progress = new Subject<number>();

      formData.append("file", file, file.name);

      // const request = new HttpRequest("PUT", `${AppSettings.mediaPlayerApiUrl}/${"need to generate a random guid here..."}/file`, formData, { reportProgress: true });

      // this.http.request(request).subscribe(event => {
      //   if (event.type === HttpEventType.UploadProgress) {
      //     const percentDone = Math.round(100 * event.loaded / event.total)
      //     progress.next(percentDone);
      //   } else if (event instanceof HttpResponse) {
      //     progress.complete();
      //   }
      // })

      status[file.name] = { progress: progress.asObservable() };
    })

    return status;
  }

}
