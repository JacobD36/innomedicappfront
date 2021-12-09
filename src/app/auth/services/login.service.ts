import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../../models/login.model';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userToken: string = '';

  constructor(
    private http: HttpClient
  ) {
    this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('expire');
  }

  login(login: LoginModel) {
    const authData = {
      dni: login.dni,
      password: login.password
    };

    return this.http.post<AuthResponse>(`${environment.url}/login`, authData).pipe(
      map(resp => {
        this.saveToken(resp.token, resp.id);
        return resp;
      })
    );
  }

  private saveToken(idToken: string, id: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    localStorage.setItem('id', id);

    let today = new Date();
    today.setSeconds(3600);

    localStorage.setItem('expire', today.getTime().toString());
  }

  public getToken(): string {
    if(localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token') || '';
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  isAuth(): boolean {
    if(this.userToken.length < 2) {
      return false;
    } else {
      const EXPIRA = Number(localStorage.getItem('expire'));
      const expiresAt = new Date();
      expiresAt.setTime(EXPIRA);

      if(expiresAt > new Date()) {
        return true;
      } else {
        return false;
      }
    }
  }
}
