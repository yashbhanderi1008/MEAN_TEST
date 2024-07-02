import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = environment.tokenKey;

  constructor() { }

  setToken(token: string){
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
  }

  getToken(){
    const token: string | null = localStorage.getItem(this.tokenKey)

    if(token){
      return JSON.parse(token)
    }
  }
}
