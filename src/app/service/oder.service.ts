import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getUrlBaseApi } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class OderService {
  private apiUrl = getUrlBaseApi('oder');
  private apiUrlReason = getUrlBaseApi('reason');
  private apiUrlCancel = getUrlBaseApi('cancel');
  private apiUrlShipper = getUrlBaseApi('shipper');
  private apiUrlShipping = getUrlBaseApi('shipping');

  constructor(private http: HttpClient) {
  }
  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  getOdersById(id:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }
  getAllOders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }
  getAllAshippers(): Observable<any> {
    return this.http.get(`${this.apiUrlShipper}/getAll`);
  }
  getAllShipping(): Observable<any> {
    return this.http.get(`${this.apiUrlShipping}/getAll`);
  }
  getshippersById(id:string): Observable<any> {
    return this.http.get(`${this.apiUrlShipper}/get/${id}`);
  }
  postData(data: any): Observable<any> {  
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  addCancel(data: any): Observable<any> {  
    return this.http.post(`${this.apiUrlCancel}/add`, data);
  }
  addShipping(data: any): Observable<any> {  
    return this.http.post(`${this.apiUrlShipping}/add`, data);
  }

  getShippingById(id:string): Observable<unknown> {   
    return this.http.get(`${this.apiUrlShipping}/get/${id}`);
  }
  getCancelById(id:string): Observable<unknown> {   
    return this.http.get(`${this.apiUrlCancel}/get/${id}`);
  }
  getAllCancel(): Observable<unknown> {   
    return this.http.get(`${this.apiUrlCancel}/getAll`);
  }
 
  getReasonlById(id:string): Observable<unknown> {   
    return this.http.get(`${this.apiUrlReason}/get/${id}`);
  }
  putData(data: any,id:string): Observable<unknown> {   
    return this.http.put(`${this.apiUrl}/edit/${id}`,data);
  }
  deleteDatayId(id:string): Observable<unknown> {   
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  getAllReasons(): Observable<any> {
    return this.http.get(`${this.apiUrlReason}/getAll`);
  }
}



