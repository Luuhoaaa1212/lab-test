import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { getUrlBaseApi } from '../constant';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = getUrlBaseApi('auth');

  constructor(private http: HttpClient, private router: Router) {}

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  getData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data, {
      withCredentials: true,
    });
  }
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, { withCredentials: true });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }
 
  logoutUser(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, { withCredentials: true });
  }
  sendMail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mail`, data);
  }
  updateUser(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data, {
      withCredentials: true,
    });
  }
}
