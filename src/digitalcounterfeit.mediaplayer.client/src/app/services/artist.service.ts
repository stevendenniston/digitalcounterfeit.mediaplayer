import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { Artist } from "../models/artist";

@Injectable({ providedIn: "root" })
export class ArtistService {

  private artistList: BehaviorSubject<Artist[]>;

  private dataStore: {
    artistList: Artist[]    
  };

  constructor(
    private http: HttpClient
  ) {
    this.dataStore = { 
      artistList: []
    };
    this.artistList = new BehaviorSubject<Artist[]>([]);    
  }

  get ArtistList(): Observable<Artist[]>{
    return this.artistList.asObservable();
  }

  GetLibraryArtistList(libraryId: string): Subscription {
    return this.http
      .get<Artist[]>(`${AppSettings.mediaPlayerApiUrl}/library/${libraryId}/artist-list`)
      .subscribe(artistList => {
        this.dataStore.artistList = artistList;
        this.artistList.next(Object.assign([], this.dataStore.artistList));
      }, error => {
        console.log(error);
      });
  }

  GetArtistById(id: string): Artist {    
      return this.dataStore.artistList.find(artist => artist.id.localeCompare(id, undefined, { sensitivity: "accent"}) === 0);
  }  

  GetArtistByName(name: string): Artist {
    return this.dataStore.artistList.find(artist => artist.name.localeCompare(name, undefined, { sensitivity: "accent" }) === 0);
  }

  PutArtist(artist: Artist): void {
    this.dataStore.artistList.push(artist);
    this.artistList.next(Object.assign([], this.dataStore.artistList));
  }
}
