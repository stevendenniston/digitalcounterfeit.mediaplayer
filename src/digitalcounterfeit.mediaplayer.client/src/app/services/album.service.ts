import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { Album } from "../models/album";

@Injectable({
  providedIn: "root"
})
export class AlbumService {
    
  private album: BehaviorSubject<Album>;
  private albumList: BehaviorSubject<Album[]>;

  constructor(private http: HttpClient) {     
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
        this.albumList.next(albumList);        
      }, error => {
        console.log(error);
      });    
  }

  GetAlbum(albumId: string): Observable<Album> {
    return this.http.get<Album>(`${AppSettings.mediaPlayerApiUrl}/album/${albumId}`);
  }

  GetArtistAlbumByName(artistId: string, name: string): Observable<Album> {
    return this.http.get<Album>(`${AppSettings.mediaPlayerApiUrl}/artist/${artistId}/album?name=${name}`);
  }
}
