import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER } from "@angular/core";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { PlayerComponent } from "./components/player/player.component";
import { SigninCallbackComponent } from "./components/signin-callback/signin-callback.component";
import { SignoutCallbackComponent } from "./components/signout-callback/signout-callback.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppSettings } from "./app-settings.service";
import { ArtistComponent } from "./components/artist/artist.component";
import { HttpInterceptorService } from "./services/http-interceptor.service";
import { ArtistListComponent } from './components/artist-list/artist-list.component';

export function initializeApp(appsettings: AppSettings): any {
  return () => appsettings.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ArtistComponent,
    ArtistListComponent,
    PlayerComponent,
    SigninCallbackComponent,
    SignoutCallbackComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [
    AppSettings,
    {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppSettings], multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
