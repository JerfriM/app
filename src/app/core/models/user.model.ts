export interface User {
  id: number;
  name: string;
  matricula: string;
  created_at?: string;
}

export interface CreateUserDTO {
  name: string;
  matricula: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  password?: string;
  matricula?: string;
}