import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, from, Observable, Subject } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { AudioTrack } from "../models/audio-track";
import { v4 as uuidv4 } from "uuid";
import { read as tagReader } from "jsmediatags";
import { ArtistService } from "./artist.service";
import { AlbumService } from "./album.service";
import { LibraryService } from "./library.service";
import { Artist } from "../models/artist";
import { Album } from "../models/album";
import { htmlAstToRender3Ast } from "@angular/compiler/src/render3/r3_template_transform";
import { ImgSrcDirective } from "@angular/flex-layout";

@Injectable({
  providedIn: "root"
})
export class AudioTrackService {

  private uploadStatus: BehaviorSubject<{ [key: string]: { progress: Observable<number> } }>;

  constructor(
    private http: HttpClient,
    private libraryService: LibraryService,
    private artistService: ArtistService,
    private albumService: AlbumService) {
      this.uploadStatus = new BehaviorSubject<{ [key: string]: { progress: Observable<number> } }>(undefined);
    }

  get UploadStatus(): Observable<{ [key: string]: { progress: Observable<number> } }> {
    return this.uploadStatus.asObservable();
  }

  GetAlbumAudioTrackList(albumId: string): Observable<AudioTrack[]> {
    return this.http.get<AudioTrack[]>(`${AppSettings.mediaPlayerApiUrl}/album/${albumId}/audio-track-list`);
  }

  GetAudioTrackStreamUri(audioTrackId: string): Observable<string>{
    const headers = new HttpHeaders().set("Content-Type", "text/plain; charset=utf-8");
    return this.http.get(`${AppSettings.mediaPlayerApiUrl}/audio-track/${audioTrackId}/stream-uri`, { headers, responseType: "text" });
  }

  UploadAudioTrackFiles(files: Set<File>): void {
    const status: { [key: string]: { progress: Observable<number> } } = {};
    const fileInfo: { id: string, id3: Observable<any>, data: File, image: any, progress: Subject<number>}[] = [];

    const id3Tags: Observable<any>[] = [];

    files.forEach(file => {
      id3Tags.push(this.ReadId3Tags(file));
    });

    forkJoin(id3Tags)
      .subscribe(tags => {

        tags.forEach(id3 => {
          const id = uuidv4();
          const progress = new Subject<number>();
          fileInfo.push({id, id3: id3.tags, data: id3.file, image: id3.tags.tags.picture, progress});
          status[id3.file.name] = { progress };          
        });

        const artistAlbumGrouping = this.GetArtistAlbumGrouping(fileInfo);

        artistAlbumGrouping.forEach((albumInfo, artistName) => {
          this.UpsertArtist(artistName)
            .subscribe(artist => {
              albumInfo.forEach((trackInfo, albumName) => {
                this.UpsertAlbum(artist.id, albumName)
                  .subscribe(album => {
                    trackInfo.forEach(track => {                      
                      this.CreateAudioTrack(track.id, artist, album, track.id3).subscribe();

                      if (track.image) {
                        const { data, format } = track.image;
                        let base64String = "";
                        for (let i = 0; i < data.length; i++) {
                          base64String += String.fromCharCode(data[i]);
                        }
                        let temp = `data:${format};base64,${window.btoa(base64String)}`;
                        const file = this.DataURIToBlob(temp);
    
                        const imageFormData: FormData = new FormData();
                        imageFormData.append("file", file, "image.jpg");
                        this.http.put(`${AppSettings.mediaPlayerApiUrl}/artist/${album.artistId}/album/${album.id}/image`, imageFormData)
                          .subscribe();
                      }
                    });
                  });
              });
            });
        });

        fileInfo.forEach(file => {
          const formData: FormData = new FormData();
          formData.append("file", file.data, file.data.name);
          this.http.put(`${AppSettings.mediaPlayerApiUrl}/audio-track/${file.id}/file`, formData, {reportProgress: true, observe: "events"})
            .subscribe(event => {
              if (event instanceof HttpResponse) {
                file.progress.next(1);
                file.progress.complete();
              }
            });          
        });

        this.uploadStatus.next(status);
      }, error => {
        console.log(error);
      });
  }

  private UpsertArtist(name: string): Observable<any> {
    const libraryId = this.libraryService.GetLibraryId();
    let artist = this.artistService.GetArtistByName(name);

    if (!artist) {
      artist = {
        id: uuidv4(),
        libraryId,
        name
      };
    }

    return this.artistService.PutArtist(artist);
  }

  private UpsertAlbum(artistId: string, name: string): Observable<Album> {
    const libraryId = this.libraryService.GetLibraryId();
    let album = this.albumService.GetArtistAlbumByName(artistId, name);

    if (!album) {
      album = {
        id: uuidv4(),
        libraryId,
        artistId,
        name
      };
    }

    return this.albumService.PutAlbum(album);
  }

  private CreateAudioTrack(id: string, artist: Artist, album: Album, id3: any): Observable<any> {
    const audioTrack: AudioTrack = {
      id,
      artist,
      album,
      name: id3.tags.title,
      number: parseInt(id3.tags.track, 10),
      discNumber: 0
    };

    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");

    return this.http.put<HttpResponse<any>>(
        `${AppSettings.mediaPlayerApiUrl}/audio-track`,
        audioTrack,
        { headers });
  }

  private ReadId3Tags(file: File): Observable<{tag: any, file: File}> {
    return from(
      new Promise<any>((resolve, reject) => {
        tagReader(file, {
          onSuccess: (id3: any) => {
            resolve({tags: id3, file});
        }, onError: (error: any) => {
          reject(error);
        }
      });
    }));
  }

  private GetArtistAlbumGrouping(fileInfo: any): Map<string, Map<string, any[]>>{
    const artistGrouping = this.GroupBy(fileInfo, (info: any) => info.id3.tags.artist);
    const artistAlbumGrouping = new Map();

    artistGrouping.forEach((trackList, artist, map) => {
      artistAlbumGrouping.set(artist, this.GroupBy(trackList, (track: any) => track.id3.tags.album));
    });

    return artistAlbumGrouping;
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
