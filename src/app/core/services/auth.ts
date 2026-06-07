import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://anhgbkuzm5.execute-api.us-east-1.amazonaws.com/auth';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(matricula: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { matricula, password })
      .pipe(
        tap((res) => {
          if (res?.token) {
            localStorage.setItem('token', res.token); // ← cambiado a 'token'
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // ← cambiado a 'token'
  }

  logout(): void {
    localStorage.removeItem('token'); // ← cambiado a 'token'
  }
}