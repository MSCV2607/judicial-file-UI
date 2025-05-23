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

  private readonly TOKEN_KEY = 'jwtToken';
  private readonly USER_ID_KEY = 'id';
  private readonly USERNAME_KEY = 'username';

  private isBrowser = typeof window !== 'undefined';

  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return this.isBrowser && !!localStorage.getItem(this.TOKEN_KEY);
  }

  register(payload: RegisterPayload): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, payload, { responseType: 'text' });
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      tap((res: any) => {
        if (this.isBrowser && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USER_ID_KEY, res.id.toString());
          localStorage.setItem(this.USERNAME_KEY, res.username);
          this.authStatusSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
      this.authStatusSubject.next(false);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getUserId(): number | null {
    const id = this.isBrowser ? localStorage.getItem(this.USER_ID_KEY) : null;
    return id ? parseInt(id, 10) : null;
  }

  getUsername(): string | null {
    return this.isBrowser ? localStorage.getItem(this.USERNAME_KEY) : null;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}