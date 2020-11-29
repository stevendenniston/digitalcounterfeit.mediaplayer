import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { AppSettings } from "../app-settings.service";
import { Library } from "../models/library";
import { v4 as uuidv4 } from "uuid";
import { NIL as uuidEmpty } from "uuid";
import { AuthService } from './auth.service';

@Injectable({ providedIn: "root" })
export class LibraryService {

  private library: BehaviorSubject<Library>;
  private dataStore: { library: Library };

  constructor(private http: HttpClient, private authService: AuthService) {
    this.dataStore = { library: null };
    this.library = new BehaviorSubject<Library>(new Library());
  }

  get Library(): Observable<Library> {
    return this.library.asObservable();
  }

  GetLibrary(): void {
    if (!this.dataStore.library) {
      this.http
        .get<Library>(`${AppSettings.mediaPlayerApiUrl}/library`)
        .subscribe(data => {
          this.dataStore.library = data;
          this.library.next(Object.assign({}, this.dataStore).library);
        }, error => {
          const httpError = error as HttpErrorResponse;

          if (httpError.status === 404) {
            this.authService.getUsername().then(name => {
              const library: Library = { id: uuidv4(), userId: uuidEmpty, name: `${name}'s Library` };
  
              const headers = new HttpHeaders();
              headers.set("Content-Type", "application/json");
  
              this.http.put<Library>(`${AppSettings.mediaPlayerApiUrl}/library`, library, { headers })
                .subscribe(() => {
                  this.GetLibrary();
                }, error => {
                  console.log(error);
                });
            });
          } else {
            console.log(error);
          }
        });
    }
  }

  GetLibraryId(): string {
    return this.dataStore.library.id;
  }
}
