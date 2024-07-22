import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  public url = 'http://localhost:3002/bp/products'; 
  constructor(private http: HttpClient) { }
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  }; 

  public get(): Observable<any> {
    return this.http.get(this.url, this.httpOptions);
  }

  public getById(id: string): Observable<any> {
    return this.http.get(`${this.url}/${id}`, this.httpOptions);
  }

  public post(parameters: any): Observable<any> {
    return this.http.post(this.url, parameters, this.httpOptions);
  }

  public put(id: string, parameters: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, parameters, this.httpOptions);
  }

  public delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, this.httpOptions);
  }
}