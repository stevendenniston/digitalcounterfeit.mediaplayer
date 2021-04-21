import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { Album } from "../models/album";

@Injectable({
  providedIn: "root"
})
export class AlbumService {

  private artistId: string;
  private album: BehaviorSubject<Album>;
  private albumList: BehaviorSubject<Album[]>;

  private dataStore: {albumList: Album[]};

  constructor(private http: HttpClient) {
    this.dataStore = {
      albumList: []
    };
    this.album = new BehaviorSubject<Album>(new Album());
    this.albumList = new BehaviorSubject<Album[]>([]);
  }

  get Album(): Observable<Album> {
    return this.album.asObservable();
  }

  get AlbumList(): Observable<Album[]> {
    return this.albumList.asObservable();
  }

  GetArtistAlbumList(artistId: string): void {
    this.http.get<Album[]>(`${AppSettings.mediaPlayerApiUrl}/artist/${artistId}/album-list`)
      .subscribe(albumList => {
        albumList.forEach(albumInfo => {
          if (this.AlbumInList(albumInfo)) {
            this.dataStore.albumList.push(albumInfo);
          }
        });
        this.artistId = artistId;
        this.albumList.next(albumList);
      }, error => {
        console.log(error);
      });
  }

  GetAlbumById(id: string): Album {
    return this.dataStore.albumList.find(album => album.id.localeCompare(id, undefined, { sensitivity: "accent" }) === 0);
  }

  GetArtistAlbumByName(artistId: string, name: string): Album {
    return this.dataStore.albumList.find(album =>
      album.artistId.localeCompare(artistId, undefined, { sensitivity: "accent" }) === 0 &&
      album.name.localeCompare(name, undefined, { sensitivity: "accent" }) === 0);
  }

  GetAlbumImageUri(artistId: string, albumId: string): Observable<string>{
    const headers = new HttpHeaders().set("Content-Type", "text/plain; charset=utf-8");
    return this.http.get(`${AppSettings.mediaPlayerApiUrl}/artist/${artistId}/album/${albumId}/image-uri`, { headers, responseType: "text" });
  }

  PutAlbum(albumInfo: Album): Observable<Album> {
    if (!this.dataStore.albumList.some(album => album.id.localeCompare(albumInfo.id, undefined, { sensitivity: "accent" }) === 0)) {
      this.dataStore.albumList.push(albumInfo);
    }
    if (this.artistId && this.artistId.localeCompare(albumInfo.artistId, undefined, { sensitivity: "accent" }) === 0){
      const list = this.dataStore.albumList.filter(album => album.artistId.localeCompare(albumInfo.artistId, undefined, { sensitivity: "accent" }) === 0);
      this.albumList.next(list);
    }

    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");

    return from(new Promise<Album>((resolve, reject) => {
      this.http.put<any>(`${AppSettings.mediaPlayerApiUrl}/album`, albumInfo, { headers })
        .toPromise()
        .then(() => resolve(albumInfo), error => reject(error));
    }));
  }

  ClearAlbumList(): void {
    this.artistId = null;
    this.albumList.next([]);
  }

  private AlbumInList(albumInfo: Album): boolean {
    return !this.dataStore.albumList.find(album => album.id.localeCompare(albumInfo.id, undefined, {sensitivity: "accent"}) === 0);
  }
}
