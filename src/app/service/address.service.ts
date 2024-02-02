import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getUrlBaseApi } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private apiUrl = getUrlBaseApi('address');

  constructor(private http: HttpClient) {}

  getDataById(id:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getAllAddress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll/address`);
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }
  putData(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/edit/${id}`);
  }
}