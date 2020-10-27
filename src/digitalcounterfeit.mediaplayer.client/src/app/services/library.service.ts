import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { Library } from "../models/library";

@Injectable({ providedIn: "root" })
export class LibraryService {

  private library: BehaviorSubject<Library>;
  private dataStore: { library: Library };

  constructor(private http: HttpClient) {
    this.dataStore = { library: null };
    this.library = new BehaviorSubject<Library>(new Library());
  }

  get Library(): Observable<Library> {
    return this.library.asObservable();
  }

  GetLibrary(): void {
    if(!this.dataStore.library) {
      this.http
        .get<Library>(`${AppSettings.mediaPlayerApiUrl}/library`)
        .subscribe(data => {
          this.dataStore.library = data;
          this.library.next(Object.assign({}, this.dataStore).library);
        }, error => {
          console.log(error);
        });
    }
  }
}
