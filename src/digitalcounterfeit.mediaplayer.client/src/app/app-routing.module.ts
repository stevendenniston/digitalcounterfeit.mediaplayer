import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArtistComponent } from "./components/artist/artist.component";
import { SigninCallbackComponent } from "./components/signin-callback/signin-callback.component";
import { SignoutCallbackComponent } from "./components/signout-callback/signout-callback.component";

const routes: Routes = [
  { path: "", component: ArtistComponent },
  { path: "signin-callback", component: SigninCallbackComponent},
  { path: "signout-callback", component: SignoutCallbackComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
