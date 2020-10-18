import { Injectable } from "@angular/core";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { IAppSettings } from "./models/app-settings";


@Injectable()
export class AppSettings {

    constructor(handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }
    private static settings: IAppSettings;
    public static idpSettings: any;
    public static mediaPlayerApiUrl: string;

    private http: HttpClient;

    load(): Promise<void> {
        const jsonFile = `assets/appsettings.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: IAppSettings) => {
                AppSettings.settings = response as IAppSettings;
                AppSettings.idpSettings = AppSettings.settings.idpSettings;
                AppSettings.mediaPlayerApiUrl = AppSettings.settings.mediaPlayerApiUrl;
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile},: ${JSON.stringify(response)}`);
            });
        });
    }
}
