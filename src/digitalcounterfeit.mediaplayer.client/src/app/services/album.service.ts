import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { Album } from "../models/album";

@Injectable({
  providedIn: "root"
})
export class AlbumService {

  constructor(private http: HttpClient) { }

  GetArtistAlbumList(artistId: string): Observable<Album[]> {
    return this.http.get<Album[]>(`${AppSettings.mediaPlayerApiUrl}/artist/${artistId}/album-list`);
  }

  GetAlbum(albumId: string): Observable<Album> {
    return this.http.get<Album>(`${AppSettings.mediaPlayerApiUrl}/album/${albumId}`);
  }
}
