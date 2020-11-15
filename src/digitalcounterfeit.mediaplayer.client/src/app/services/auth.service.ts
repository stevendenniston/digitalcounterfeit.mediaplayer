import { Injectable } from "@angular/core";
import { UserManager, User, SignoutResponse } from "oidc-client";
import { Subject } from "rxjs";
import { AppSettings } from "../app-settings.service";

@Injectable({ providedIn: "root"})
export class AuthService {
  private userManager: UserManager;
  private user: User;
  private loginChangedSubject = new Subject<boolean>();

  loginChanged = this.loginChangedSubject.asObservable();

  constructor() {
    this.userManager = new UserManager(AppSettings.idpSettings);
   }

  login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  logout(): void {
    this.userManager.signoutRedirect();
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.userManager.getUser();
    const isLoggedIn = !!user && !user.expired;
    if (this.user !== user){
      this.loginChangedSubject.next(isLoggedIn);
    }
    this.user = user;
    return isLoggedIn;
  }

  async completeLogin(): Promise<User> {
    const user = await this.userManager.signinRedirectCallback();
    this.user = user;
    this.loginChangedSubject.next(!!user && !user.expired);
    return user;
  }

  completeLogout(): Promise<SignoutResponse> {
    this.user = null;
    return this.userManager.signoutRedirectCallback();
  }

  getAccessToken(): Promise<string> {
    return this.userManager.getUser().then(user => {
      if (!!user && !user.expired){
        return user.access_token;
      }
      else {
        return null;
      }
    });
  }

}
