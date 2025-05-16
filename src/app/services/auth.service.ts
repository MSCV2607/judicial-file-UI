import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  dni: string;
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, payload, { responseType: 'text' });
  }

  login(payload: { username: string; password: string }): Observable<string> {
  return this.http.post(`${this.apiUrl}/login`, payload, { responseType: 'text' });
}
}
