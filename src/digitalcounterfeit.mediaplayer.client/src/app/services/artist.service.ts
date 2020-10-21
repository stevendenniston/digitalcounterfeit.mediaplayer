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

  GetArtist(artistId: string): Artist {    
      return this.dataStore.artistList.find(artist => artist.id.localeCompare(artistId, undefined, { sensitivity: "accent"}) === 0);    
  }  
}
