import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getUrlBaseApi } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class OderDetailService {
  private apiUrl = getUrlBaseApi('oderDetail');
  private apiUrlComplete = getUrlBaseApi('complete');
  constructor(private http: HttpClient) {
  }
  getDataAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }
  updateOdersDetail(data:any):Observable<unknown> {   
    return this.http.put(`${this.apiUrl}/update`,data);
  }
  updateOdersDetailAll(data:any):Observable<unknown> {   
    return this.http.put(`${this.apiUrl}/updateAll`,data);
  }
  addComplete(data:any):Observable<unknown> {   
    return this.http.post(`${this.apiUrlComplete}/add`,data);
  }
  getAllComplete(): Observable<any> {
    return this.http.get(`${this.apiUrlComplete}/getAll`);
  }
  getCompleteById(id:string):Observable<unknown> {   
    return this.http.get(`${this.apiUrlComplete}/get/${id}`);
  }
  getOdersDetailById(id:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }
  getOdersDetailByIdOderDetail(id:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/getId/${id}`);
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



