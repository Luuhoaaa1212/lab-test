import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getUrlBaseApi } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailService {
  private apiUrl = getUrlBaseApi('productDetail');
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  getDataById(id:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/detail/${id}`);
  }
  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }
  putData(data: any,id:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, data);
  }
  deleteData(id:any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
}
