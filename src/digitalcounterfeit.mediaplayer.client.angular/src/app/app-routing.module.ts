import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AlbumComponent } from "./components/album/album.component";
import { ArtistListComponent } from "./components/artist-list/artist-list.component";
import { ArtistComponent } from "./components/artist/artist.component";

const routes: Routes = [
  { path: "album/:albumId", component: AlbumComponent },
  { path: "artist/:artistId", component: ArtistComponent },  
  { path: "", component: ArtistListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
