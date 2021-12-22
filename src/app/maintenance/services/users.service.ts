import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersResponse } from '../../models/users_response.model';
import { LoginService } from '../../auth/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private authService: LoginService
  ) { }

  userList(search: string, page: string, f_ini: string, f_fin: string): Observable<UsersResponse[]> {
    const params: HttpParams = new HttpParams().set('search', search).set('page', page).set('f_ini', f_ini).set('f_fin', f_fin);
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type', 'application/json'
    ).set(
      'Authorization', 'Bearer' + this.authService.getToken()
    );
    
    return this.http.get<UsersResponse[]>(`${environment.url}/usersList`, {headers, params});
  }

  usersCount(search: string, f_ini: string, f_fin: string) {
    const params: HttpParams = new HttpParams().set('search', search).set('f_ini', f_ini).set('f_fin', f_fin);
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type', 'application/json'
    ).set(
      'Authorization', 'Bearer' + this.authService.getToken()
    );
    
    return this.http.get<number>(`${environment.url}/usersCount`, {headers, params});
  }
}
