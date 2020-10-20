import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { ArtistComponent } from './components/artist/artist.component';
import { SigninCallbackComponent } from "./components/signin-callback/signin-callback.component";
import { SignoutCallbackComponent } from "./components/signout-callback/signout-callback.component";

const routes: Routes = [
  { path: "artist/:artistId", component: ArtistComponent },
  { path: "signin-callback", component: SigninCallbackComponent},
  { path: "signout-callback", component: SignoutCallbackComponent},
  { path: "", component: ArtistListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
