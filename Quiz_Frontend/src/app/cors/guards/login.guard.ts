import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Location } from '@angular/common';


@Injectable({ providedIn: 'root' })
export class LoginGuard {
  constructor(private _token: TokenService, private _locationService: Location) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const accessToken = this._token.getToken();
    if (accessToken) {
      this._locationService.back();
      return false;
    } else {
      return true;
    }
  }
}
