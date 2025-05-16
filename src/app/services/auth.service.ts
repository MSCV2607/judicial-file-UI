import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface RegisterPayload { /* ... */ }
export interface LoginPayload { /* ... */ }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private isBrowser: boolean;
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {
    this.isBrowser = typeof window !== 'undefined';
  }

  register(payload: RegisterPayload): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, payload, { responseType: 'text' });
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      tap((res: any) => {
        if (this.isBrowser) {
          localStorage.setItem('token', res.token);
          this.authStatus.next(true);
        }
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');  
      this.authStatus.next(false);   
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}


