import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  constructor(private userService: UserService) {}

  getAll(): Observable<User[]> {
    return this.userService.getAll();
  }

  getById(id: number): Observable<User> {
    return this.userService.getById(id);
  }

  create(data: CreateUserDTO): Observable<User> {
    return this.userService.create(data);
  }

  update(id: number, data: UpdateUserDTO): Observable<User> {
    return this.userService.update(id, data);
  }

  delete(id: number): Observable<any> {
    return this.userService.delete(id);
  }
}