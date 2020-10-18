import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { Artist } from "../models/artist";

@Injectable({ providedIn: "root" })
export class ArtistService {

  private artists: BehaviorSubject<Artist[]>;

  private dataStore: {
    artists: Artist[]
  };

  constructor(private http: HttpClient) {
    this.dataStore = { artists: [] };
    this.artists = new BehaviorSubject<Artist[]>([]);
  }

  get Artists(): Observable<Artist[]>{
    return this.artists.asObservable();
  }

  GetLibraryArtistList(libraryId: string): Subscription {
    return this.http
      .get<Artist[]>(`${AppSettings.mediaPlayerApiUrl}/library/${libraryId}/artist-list`)
      .subscribe(data => {
        this.dataStore.artists = data;
        this.artists.next(Object.assign({}, this.dataStore).artists);
      }, error => {
        console.log(error);
      });
  }
}
