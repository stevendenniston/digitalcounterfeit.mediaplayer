import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { PlayerComponent } from "./components/player/player.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ArtistComponent } from "./components/artist/artist.component";
import { ArtistListComponent } from "./components/artist-list/artist-list.component";
import { AlbumComponent } from "./components/album/album.component";
import { UploadComponent } from "./components/upload/upload.component";
import { UploadDialogComponent } from "./components/upload-dialog/upload-dialog.component";
import { MenuComponent } from './components/menu/menu.component';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from "src/environments/environment";
import { AuthHttpInterceptor } from "@auth0/auth0-angular";

@NgModule({
  declarations: [
    AppComponent,
    ArtistComponent,
    ArtistListComponent,
    PlayerComponent,    
    AlbumComponent,
    UploadComponent,
    UploadDialogComponent,    
    MenuComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AuthModule.forRoot({
      ...environment.auth, 
      httpInterceptor: { allowedList: [`${environment.mediaPlayerApiUrl}/api/*`]}
    })
  ],
  providers: [        
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
