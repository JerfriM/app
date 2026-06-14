import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class NotificationsPage {
  email: string = '';
  subject: string = '';
  message: string = '';
  enviando: boolean = false;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  enviarNotificacion() {
    if (!this.email || !this.subject || !this.message) {
      this.mostrarToast('Todos los campos son obligatorios');
      return;
    }

    this.enviando = true;

    this.http.post(
      `${environment.apiUrl}/notifications/send`,
      { email: this.email, subject: this.subject, message: this.message },
      { headers: this.headers() }
    ).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarToast('Mensaje enviado correctamente');
        this.email = '';
        this.subject = '';
        this.message = '';
      },
      error: () => {
        this.enviando = false;
        this.mostrarToast('Error al enviar mensaje');
      }
    });
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}