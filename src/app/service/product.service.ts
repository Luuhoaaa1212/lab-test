import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getUrlBaseApi } from '../constant';

@Injectable({
  providedIn: 'root',
})

export class ProductService {
  private apiUrl = getUrlBaseApi('product');
  constructor(private http: HttpClient) {
  }
  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  postData(data: any): Observable<any> {  
    return this.http.post(`${this.apiUrl}/add`, data);
  }
  putData(data: any,id:string): Observable<unknown> {   
    return this.http.put(`${this.apiUrl}/edit/${id}`,data);
  }
  deleteDatayId(id:string): Observable<unknown> {   
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}



