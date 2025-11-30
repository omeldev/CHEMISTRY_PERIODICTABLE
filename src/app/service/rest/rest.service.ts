import { Injectable } from '@angular/core';
import {HttpService} from "../http/http.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  public static readonly REST_URL: string = 'http://localhost:3000/api/v1/';
  constructor(private readonly http: HttpService) { }

  public get$<T>(url: string, parameters?: any): Observable<T | null> {
    return this.http.get$<T>(RestService.REST_URL + url, parameters);
  }

  public post$<T>(url: string, body: any, parameters?: any): Observable<T | null> {
    return this.http.post$<T>(RestService.REST_URL + url, body, parameters);
  }

  public put$<T>(url: string, body: any, parameters?: any): Observable<T | null> {
    return this.http.put$<T>(RestService.REST_URL + url, body, parameters);
  }

  public patch$<T>(url: string, body: any, parameters?: any): Observable<T | null> {
    return this.http.patch$<T>(RestService.REST_URL + url, body, parameters);
  }

  public delete$<T>(url: string, parameters?: any): Observable<T | null> {
    return this.http.delete$<T>(RestService.REST_URL + url, parameters);
  }


}
