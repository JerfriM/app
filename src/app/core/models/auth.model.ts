export interface LoginRequest {
  matricula: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    name: string;
    matricula: string;
  };
}