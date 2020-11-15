import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

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
