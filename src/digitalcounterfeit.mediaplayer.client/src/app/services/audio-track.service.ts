import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../app-settings.service';
import { AudioTrack } from '../models/audio-track';
import { v4 as uuidv4 } from "uuid";
import { read as tagReader } from "jsmediatags";
import { ArtistService } from './artist.service';
import { AlbumService } from './album.service';
import { LibraryService } from './library.service';
import { Album } from '../models/album';

@Injectable({
  providedIn: 'root'
})
export class AudioTrackService {

  constructor(
    private http: HttpClient,
    private libraryService: LibraryService,
    private artistService: ArtistService, 
    private albumService: AlbumService) { }

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
      const id = uuidv4();

      formData.append("file", file, file.name);

      tagReader(file, {
        onSuccess: id3 => {
          this.PutAudioTrack(id, id3);
          //console.log(id3);
        },
        onError: error => {
          console.log(error);
        }
      });

      this.http.put(`${AppSettings.mediaPlayerApiUrl}/audio-track/${id}/file`, formData, {reportProgress: true, observe: "events"})
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total)
            progress.next(percentDone);
          } else if (event instanceof HttpResponse) {
            progress.complete();
          }
        });

      status[file.name] = { progress: progress.asObservable() };      
    })

    return status;
  }

  PutAudioTrack(id: string, id3: any): void {
    let isNewArtist = false;
    let isNewAlbum = false;
    let artist = this.artistService.GetArtistByName(id3.tags.artist);    
    
    if (!artist) {      
      isNewArtist = true;
      artist = {
        id: uuidv4(),
        libraryId: this.libraryService.GetLibraryId(),
        name: id3.tags.artist
      };
    }

    const sub = this.albumService.AlbumList.subscribe(albumList => {
      let album = albumList.find(album => album.artistId.localeCompare(artist.id, undefined, { sensitivity: "accent"}) === 0);

      if (!album) {
        isNewAlbum = true;
        album = {
          id: uuidv4(),
          artistId: artist.id,
          libraryId: this.libraryService.GetLibraryId(),
          name: id3.tags.album
        };
      }  

      this.albumService.PutArtistAlbum(album, isNewArtist, isNewAlbum);
  
      const audioTrack: AudioTrack = {
        id: id,
        artist: artist,
        album: album,
        name: id3.tags.title,
        number: parseInt(id3.tags.track),
        discNumber: 0
      };

      console.log(audioTrack);
      const headers = new HttpHeaders();
      headers.set("Content-Type", "application/json");      
      this.http.put(`${AppSettings.mediaPlayerApiUrl}/audio-track`, audioTrack, { headers: headers }).subscribe();

    }, error => {
      console.log(error);
    })    

    sub.unsubscribe();

    this.albumService.GetArtistAlbumList(artist.id);
  }

}