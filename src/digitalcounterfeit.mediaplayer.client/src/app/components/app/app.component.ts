import { Component, OnInit } from "@angular/core";
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit{

  title = "mediaplayer-client";
  isLoggedIn = false;
  isDesktop = false;

  constructor(private authService: AuthService, private deviceService: DeviceDetectorService) {
  }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop();
    this.authService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.loginChanged.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}
