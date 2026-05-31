import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../core/services/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class HomePage {
  name: string = '';
  matricula: string = '';
  password: string = '';
  isRegisterMode: boolean = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ejecutarAccion() {
    if (!this.matricula || !this.password) {
      this.presentToast('Por favor, rellene los campos obligatorios.');
      return;
    }

    if (this.isRegisterMode) {
      this.authService.register({
        name: this.name,
        matricula: this.matricula,
        password: this.password
      }).subscribe({
        next: () => {
          this.presentToast('¡Registro exitoso! Procede a iniciar sesión.');
          this.isRegisterMode = false;
          this.name = '';
        },
        error: (err: any) => {
          this.presentToast(
            'Error al registrar: ' + (err?.error || 'Servidor inaccesible')
          );
        }
      });
    } else {
      this.authService.login(this.matricula, this.password).subscribe({
        next: () => {
          this.presentToast('Acceso concedido.');
          this.navCtrl.navigateRoot('/dashboard');
        },
        error: () => {
          this.presentToast('Matrícula o contraseña incorrecta.');
        }
      });
    }
  }

  toggleModo() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }
}