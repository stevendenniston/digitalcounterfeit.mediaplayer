import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { AudioTrack } from "../models/audio-track";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class AudioTrackService {

  private uploadStatus: BehaviorSubject<{ [key: string]: { progress: Observable<number> } }>;

  constructor(
    private http: HttpClient) {
      this.uploadStatus = new BehaviorSubject<{ [key: string]: { progress: Observable<number> } }>(undefined);
    }

  get UploadStatus(): Observable<{ [key: string]: { progress: Observable<number> } }> {
    return this.uploadStatus.asObservable();
  }

  GetAlbumAudioTrackList(albumId: string): Observable<AudioTrack[]> {
    return this.http.get<AudioTrack[]>(`${environment.mediaPlayerApiUrl}/album/${albumId}/audio-track-list`);
  }

  GetAudioTrackStreamUri(audioTrackId: string): Observable<string>{
    const headers = new HttpHeaders().set("Content-Type", "text/plain; charset=utf-8");
    return this.http.get(`${environment.mediaPlayerApiUrl}/audio-track/${audioTrackId}/stream-uri`, { headers, responseType: "text" });
  }

  UploadAudioTrackFiles(files: Set<File>): void {
    const status: { [key: string]: { progress: Observable<number> } } = {};    

    files.forEach(file => {      
      const progress = new Subject<number>();
      const formData: FormData = new FormData();
      formData.append("file", file, file.name);
      this.http.post(`${environment.mediaPlayerApiUrl}/audio-track/file`, formData, {reportProgress: true, observe: "events"})
        .subscribe(event => {
          if (event instanceof HttpResponse) {
            progress.next(1);
            progress.complete();
          }
        });  
        status[file.name] = { progress };          
    });
  }
  
  // may use these else where (elsewhere? i guess...), how are common angular utils handled?
  private GroupBy(list: any[], keyGetter: any): Map<any, any> {
    const map = new Map();
    list.forEach((item: any) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
  }

  private DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }
}
