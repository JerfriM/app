import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = 'https://anhgbkuzm5.execute-api.us-east-1.amazonaws.com';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/users`, { headers: this.headers() });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/users/${id}`, { headers: this.headers() });
  }

  create(data: CreateUserDTO): Observable<User> {
    return this.http.post<User>(`${this.api}/users`, data, { headers: this.headers() });
  }

  update(id: number, data: UpdateUserDTO): Observable<User> {
    return this.http.put<User>(`${this.api}/users/${id}`, data, { headers: this.headers() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/users/${id}`, { headers: this.headers() });
  }
}