import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Library } from "../models/library";
import { v4 as uuidv4 } from "uuid";
import { NIL as uuidEmpty } from "uuid";
import { environment } from "src/environments/environment";
import { AuthService } from "@auth0/auth0-angular";


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
        .get<Library>(`${environment.mediaPlayerApiUrl}/library`)
        .subscribe(data => {
          this.dataStore.library = data;
          this.library.next(Object.assign({}, this.dataStore).library);
        }, error => {
          const httpError = error as HttpErrorResponse;

          if (httpError.status === 404) {            
            var userSubscription =  
              this.authService.user$.subscribe(user => {
                if (user) {
                  const library: Library = { id: uuidv4(), userId: uuidEmpty, name: `${user.name}'s Library` };
      
                  const headers = new HttpHeaders();
                  headers.set("Content-Type", "application/json");
      
                  this.http.put<Library>(`${environment.mediaPlayerApiUrl}/library`, library, { headers })
                    .subscribe(() => {                      
                      this.GetLibrary();
                    }, error => {
                      console.log(error);
                    });
                }
                userSubscription.unsubscribe();
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
