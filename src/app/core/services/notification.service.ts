import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationPayload {
  email: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  
  // Reemplaza esto con la URL real de tu API Gateway expuesta en tus outputs de Terraform
  private apiUrl = 'https://anhgbkuzm5.execute-api.us-east-1.amazonaws.com/send';

  sendNotification(payload: NotificationPayload): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(this.apiUrl, payload);
  }
}