import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, Subject } from 'rxjs';
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
    const fileInfo: { id: string, id3: Observable<any>, file: File, progress: Observable<number>}[] = [];
    
    const id3Tags: Observable<any>[] = [];
   
    // read id3 tags
    files.forEach(file => {
      id3Tags.push(this.ReadId3Tags(file));      
    })

    forkJoin(id3Tags)
      .subscribe(tags => {
        
        tags.forEach(id3 => {
          const id = uuidv4();
          const progress = new Observable<number>();
          fileInfo.push({id: id, id3: id3.tag, file: id3.file, progress: progress});
        })

        const artistGrouping = this.GroupBy(fileInfo, (info: any) => info.id3.tags.artist);

        console.log(artistGrouping);

      }, error => {
        console.log(error);
      })    
    
    // upload each file
    
    // this.PutAudioTrack(id, id3);
    // const formData: FormData = new FormData();
    // formData.append("file", file, file.name);
    // this.http.put(`${AppSettings.mediaPlayerApiUrl}/audio-track/${id}/file`, formData, {reportProgress: true, observe: "events"})
    //   .subscribe(event => {          
    //     if (event instanceof HttpResponse) {
    //       progress.complete();
    //     }
    //   });

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

  private ReadId3Tags(file: File): Observable<{tag: any, file: File}> {        
    return from(new Promise<any>((resolve, reject) => {
      tagReader(file, {
        onSuccess: (id3: any) => {
          resolve({tag: id3, file: file});
       },
       onError: (error: any) => {
         reject(error);
       }
     })
    }));
  }

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
  }; 
  
}