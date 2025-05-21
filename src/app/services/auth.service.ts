import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  dni: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private isBrowser = typeof window !== 'undefined';

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return this.isBrowser && !!localStorage.getItem('jwtToken');
  }

  register(payload: RegisterPayload): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, payload, { responseType: 'text' });
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      tap((res: any) => {
        if (this.isBrowser) {
          localStorage.setItem('jwtToken', res.token);
          this.authStatus.next(true);
        }
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('jwtToken');
      this.authStatus.next(false);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('jwtToken') : null;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}