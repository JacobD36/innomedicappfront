import { Injectable } from '@angular/core';
import { LoginService } from '../auth/services/login.service';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: LoginService,
    private router: Router
  ) {
  }
  canActivate(): boolean {
    if(this.auth.isAuth()) {
      return true;
    } else {
      this.router.navigateByUrl('/auth');
      return false;
    }
  }
}
