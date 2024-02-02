import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getUrlBaseApi } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private apiUrl = getUrlBaseApi('color');

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/data`, data);
  }
}