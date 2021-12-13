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

  userList(): Observable<UsersResponse[]> {
    const params: HttpParams = new HttpParams().set('search', '').set('page', '1');
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type', 'application/json'
    ).set(
      'Authorization', 'Bearer' + this.authService.getToken()
    );
    
    return this.http.get<UsersResponse[]>(`${environment.url}/usersList`, {headers, params});
  }
}
