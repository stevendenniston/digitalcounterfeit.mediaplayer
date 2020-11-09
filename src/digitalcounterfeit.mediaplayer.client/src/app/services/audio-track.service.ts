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
import { Artist } from '../models/artist';
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
          this.http.put(`${AppSettings.mediaPlayerApiUrl}/audio-track/${id}/file`, formData, {reportProgress: true, observe: "events"})
            .subscribe(event => {          
              if (event instanceof HttpResponse) {
                progress.complete();
              }
            });
        },
        onError: error => {
          console.log(error);
        }
      });
      
      status[file.name] = { progress: progress.asObservable() };
    })

    return status;
  }

  PutAudioTrack(id: string, id3: any): void {
    const libraryId = this.libraryService.GetLibraryId();    
    let artist = this.artistService.GetArtistByName(id3.tags.artist); 
    
    if (!artist) {
      artist = {
        id: uuidv4(),
        libraryId: libraryId,
        name: id3.tags.artist
      };
      this.artistService.PutArtist(artist);
    }

    this.albumService
      .GetArtistAlbumByName(artist.id, id3.tags.album)
      .subscribe(album => {        
        this.CreateAudioTrack(id, artist, album, id3);
      }, error => {
        if (error.status === 404) {
          const album = {
            id: uuidv4(),
            artistId: artist.id,
            libraryId: this.libraryService.GetLibraryId(),
            name: id3.tags.album
          };
          this.CreateAudioTrack(id, artist, album, id3);
        } else {
          console.log(error);
        }
      });
  }

  private CreateAudioTrack(id: string, artist: Artist, album: Album, id3: any): void {
    const audioTrack: AudioTrack = {
      id: id,
      artist: artist,
      album: album,
      name: id3.tags.title,
      number: parseInt(id3.tags.track),
      discNumber: 0
    };

    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");

    this.http.put(
        `${AppSettings.mediaPlayerApiUrl}/audio-track`, 
        audioTrack, 
        { headers: headers })
      .subscribe();
  }
}