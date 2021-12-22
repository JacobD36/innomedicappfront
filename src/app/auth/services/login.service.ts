import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel, TokenModel } from '../../models/login.model';
import { map, tap } from 'rxjs/operators';
import { AuthResponse } from '../../models/auth-response.model';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.model';

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
    today.setSeconds(900);

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
        this.renewToken();
        return true;
      } else {
        Swal.fire({
          title: 'Tiempo de sesión expirado',
          text: "Su tiempo de sesión ha expirado por inactividad. Por favor, vuelva a ingresar al sistema.",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.logout();
        return false;
      }
    }
  }

  renewToken() {
    const params: HttpParams = new HttpParams().set('id', localStorage.getItem('id')!);
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type', 'application/json'
    ).set(
      'Authorization', 'Bearer' + this.getToken()
    );

    this.http.get<User>(`${environment.url}/getUser`, {headers, params}).pipe(
      tap(resp => {
        this.http.post<TokenModel>(`${environment.url}/renewToken`, resp, {headers}).subscribe(data => {
          localStorage.setItem('token', data.token);
          let today = new Date();
          today.setSeconds(900);
          localStorage.setItem('expire', today.getTime().toString());
        });
      })
    ).subscribe();
  }
}
