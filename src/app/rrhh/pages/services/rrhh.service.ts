import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginService } from '../../../auth/services/login.service';
import { Observable } from 'rxjs';
import { BusinessResponse } from '../../../models/business.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RrhhService {

  constructor(
    private http: HttpClient,
    private authService: LoginService
  ) { }

  businessList(search: string, page: string, f_ini: string, f_fin: string): Observable<BusinessResponse[]> {
    const params: HttpParams = new HttpParams().set('search', search).set('page', page).set('f_ini', f_ini).set('f_fin', f_fin);
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type', 'application/json'
    ).set(
      'Authorization', 'Bearer' + this.authService.getToken()
    );
    
    return this.http.get<BusinessResponse[]>(`${environment.url}/getBusiness`, {headers, params});
  }

  businessCount(search: string, f_ini: string, f_fin: string) {
    const params: HttpParams = new HttpParams().set('search', search).set('f_ini', f_ini).set('f_fin', f_fin);
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type', 'application/json'
    ).set(
      'Authorization', 'Bearer' + this.authService.getToken()
    );

    return this.http.get<number>(`${environment.url}/businessCount`, {headers, params});
  }

  saveNewBusiness(business: BusinessResponse) {
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type', 'application/json'
    ).set(
      'Authorization', 'Bearer' + this.authService.getToken()
    );

    return this.http.post(`${environment.url}/newBusiness`, business, {headers: headers});
  }
}
