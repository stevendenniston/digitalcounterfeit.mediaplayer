import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { AppSettings } from "../app-settings.service";

@Injectable({
  providedIn: "root"
})
export class CloudService {

  files: any = [
    {
      id: AppSettings.fileId,
      name: "Track 1",
      artist: "Nothing Personal"
    }
  ];

  constructor() { }

  getFiles(): any {
    return of(this.files);
  }
}
