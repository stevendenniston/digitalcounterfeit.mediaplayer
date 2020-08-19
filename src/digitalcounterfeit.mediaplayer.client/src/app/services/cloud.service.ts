import { Injectable } from '@angular/core';
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  files: any = [
    {
      url: "",
      name: "Track 1",
      artist: "Nothing Personal"
    }
  ]

  constructor() { }

  getFiles() {
    return of(this.files);
  }
  
}
