import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../../models/user.model';
import { LoginService } from '../../../auth/services/login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  nombre: string = '';

  constructor(
    private http: HttpClient,
    private authService: LoginService
  ) { }

  userInfo(id: string): Observable<User> {
    const params: HttpParams = new HttpParams().set('id', id);
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type', 'application/json'
    ).set(
      'Authorization', 'Bearer' + this.authService.getToken()
    );

    return this.http.get<User>(`${environment.url}/getUser`, {headers, params});
  }
}
