import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  isLoggedIn = false;
  isDesktop = false;

  constructor(
    private authService: AuthService, 
    private deviceService: DeviceDetectorService) {
  }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop();        
    this.authService.isAuthenticated$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  login(): void {
    this.authService.loginWithRedirect();
  }

  logout(): void {
    this.authService.logout();
  }
}
