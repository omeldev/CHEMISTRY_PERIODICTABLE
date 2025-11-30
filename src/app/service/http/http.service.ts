import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {map, Observable, shareReplay} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private readonly client: HttpClient) { }

  public get$<T>(url: string, parameters?: any): Observable<T | null> {
    return this.execute$((options: any) => this.client.get<T>(url, options) as Observable<HttpResponse<T>>, parameters);
  }

  public post$<T>(url: string, body: any, parameters?: any): Observable<T | null> {
    return this.execute$((options: any) => this.client.post<T>(url, body, options) as Observable<HttpResponse<T>>, parameters);
  }

  public put$<T>(url: string, body: any, parameters?: any): Observable<T | null> {
    return this.execute$((options: any) => this.client.put<T>(url, body, options) as Observable<HttpResponse<T>>, parameters);
  }

  public patch$<T>(url: string, body: any, parameters?: any): Observable<T | null> {
    return this.execute$((options: any) => this.client.patch<T>(url, body, options) as Observable<HttpResponse<T>>, parameters);
  }

  public delete$<T>(url: string, parameters?: any): Observable<T | null> {
    return this.execute$((options: any) => this.client.delete<T>(url, options) as Observable<HttpResponse<T>>, parameters);
  }

  public execute$<T>(execute: (options: any) => Observable<HttpResponse<T>>, parameters?: any): Observable<T | null> {
    const options: any = {
      headers: new HttpHeaders(),
      withCredentials: true,
      observe: 'response',
      params: parameters ?? {},
    };
    return execute(options).pipe(
      map((response: HttpResponse<T>) => response.body),
      shareReplay(1),
    );
  }
}
