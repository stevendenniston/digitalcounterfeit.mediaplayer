import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { IAppSettings } from "./models/app-settings.model";


@Injectable({
    providedIn: "root"
})
export class AppSettings {

    private static settings: IAppSettings;
    public static idpSettings: any;
    public static mediaPlayerApiUrl: string;

    // TODO: remove once playlist structure is built
    public static fileId: string;

    constructor(private http: HttpClient) {}

    load(): Promise<void> {
        const jsonFile = `assets/appsettings.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: IAppSettings) => {
                AppSettings.settings = response as IAppSettings;
                AppSettings.idpSettings = AppSettings.settings.idpSettings;
                AppSettings.mediaPlayerApiUrl = AppSettings.settings.mediaPlayerApiUrl;
                AppSettings.fileId = AppSettings.settings.fileId;
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile},: ${JSON.stringify(response)}`);
            });
        });
    }
}
