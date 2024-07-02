import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post('user/', user)
  }

  login(user: any): Observable<any>{
    return this.http.post('user/login', user)
  }
}
