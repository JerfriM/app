import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { UserRepository } from '../../core/repositories/user.repository';
import { AuthService } from '../../core/services/auth'; // <-- Ajustada la ruta típica basada en tu árbol
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class UsersPage {
  usuarios: User[] = [];
  cargando: boolean = true;

  constructor(
    private userRepository: UserRepository,
    private authService: AuthService, // <-- Inyección del servicio para registro
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.userRepository.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarToast('Error al cargar usuarios');
        this.cargando = false;
      }
    });
  }

  async crearUsuario() {
    const alert = await this.alertCtrl.create({
      header: 'Crear Usuario',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre completo' },
        { name: 'matricula', type: 'text', placeholder: 'Matrícula' },
        { name: 'password', type: 'password', placeholder: 'Contraseña' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            console.log('Datos enviados desde el CRUD:', data);

            if (!data.name || !data.matricula || !data.password) {
              this.mostrarToast('Todos los campos son obligatorios');
              return false; // Mantiene el alert abierto si hay error
            }

            // Usamos authService para registrar directamente en el endpoint público
            this.authService.register({
              name: data.name,
              matricula: data.matricula,
              password: data.password
            }).subscribe({
              next: () => {
                this.mostrarToast('Usuario creado exitosamente');
                this.cargarUsuarios();
              },
              error: (err: any) => { // <-- Corregido: Tipo explícito 'any'
                console.error('Error al crear usuario:', err);
                this.mostrarToast('Error al crear usuario');
              }
            });
            return; // <-- Corregido: Añadido retorno para cumplir con TS7030
          }
        }
      ]
    });
    await alert.present();
  }

  async editarUsuario(user: User) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Usuario',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nombre completo', value: user.name },
        { name: 'matricula', type: 'text', placeholder: 'Matrícula', value: user.matricula },
        { name: 'password', type: 'password', placeholder: 'Nueva contraseña (opcional)' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.name || !data.matricula) {
              this.mostrarToast('Nombre y Matrícula son obligatorios');
              return false;
            }

            this.userRepository.update(user.id, data).subscribe({
              next: () => {
                this.mostrarToast('Usuario actualizado');
                this.cargarUsuarios();
              },
              error: (err: any) => { // <-- Corregido: Tipo explícito 'any'
                console.error('Error al actualizar:', err);
                this.mostrarToast('Error al actualizar');
              }
            });
            return; // <-- Corregido: Añadido retorno para cumplir con TS7030
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarUsuario(user: User) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Eliminar a ${user.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.userRepository.delete(user.id).subscribe({
              next: () => {
                this.mostrarToast('Usuario eliminado');
                this.cargarUsuarios();
              },
              error: (err: any) => { // <-- Corregido: Tipo explícito 'any'
                console.error('Error al eliminar:', err);
                this.mostrarToast('Error al eliminar');
              }
            });
          }
        }
      ]
    });
    await alert.present();
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