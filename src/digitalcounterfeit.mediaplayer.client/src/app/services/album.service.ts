import { HttpClient } from "@angular/common/http";
import { removeSummaryDuplicates } from '@angular/compiler';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { Album } from "../models/album";

@Injectable({
  providedIn: "root"
})
export class AlbumService {
  
  private dataStore: { artistAlbumMapList: {artistId: string, albumList: Album []} []};
  private album: BehaviorSubject<Album>;
  private albumList: BehaviorSubject<Album[]>;

  constructor(private http: HttpClient) { 
    this.dataStore = { artistAlbumMapList: [] };
    this.album = new BehaviorSubject<Album>(new Album());
    this.albumList = new BehaviorSubject<Album[]>([]);
  }

  get Album(): Observable<Album> {
    return this.album.asObservable();    
  }

  get AlbumList(): Observable<Album[]> {
    return this.albumList.asObservable();
  }

  PutArtistAlbum(album: Album, isNewArtist: boolean, isNewAlbum: boolean): void {
    if (isNewArtist) {
      this.dataStore.artistAlbumMapList.push({artistId: album.artistId, albumList: [album]});          
    } else if (!isNewArtist && isNewAlbum) {
      this.dataStore.artistAlbumMapList.map(x => x.artistId === album.artistId ? x.albumList.push(album) : x);      
    } else if (!isNewArtist && !isNewAlbum) {
      this.dataStore.artistAlbumMapList.map(x => x.artistId === album.artistId ? x.albumList.map(a => a.id === album.id ? a = album : a) : x);
    }
  }

  GetArtistAlbumList(artistId: string): Album[] {
    let result = this.dataStore
      .artistAlbumMapList
      .find(artistAlbumMap => 
        artistAlbumMap.artistId.localeCompare(artistId, undefined, { sensitivity: "accent"}) === 0);
      
    if (!result){
      this.http.get<Album[]>(`${AppSettings.mediaPlayerApiUrl}/artist/${artistId}/album-list`)
        .subscribe(albumList => {
          this.dataStore.artistAlbumMapList.push({artistId: artistId, albumList: albumList});
          this.albumList.next(albumList);
          return albumList;
        }, error => {
          console.log(error);
        });
    } else {
      this.albumList.next(result.albumList);
      return result.albumList;
    }
  }

  GetAlbum(albumId: string): Observable<Album> {
    return this.http.get<Album>(`${AppSettings.mediaPlayerApiUrl}/album/${albumId}`);
  }
}
