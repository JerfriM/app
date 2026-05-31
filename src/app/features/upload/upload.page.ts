import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpEventType } from '@angular/common/http';
import { UploadService } from '../../core/services/upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class UploadPage {
  archivoSeleccionado: File | null = null;
  previewUrl: string | null = null;
  progreso: number = 0;
  subiendo: boolean = false;
  urlSubida: string | null = null;

  constructor(
    private uploadService: UploadService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  seleccionarArchivo(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoSeleccionado = file;
    this.urlSubida = null;
    this.progreso = 0;

    // Preview si es imagen
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  subirArchivo() {
    if (!this.archivoSeleccionado) {
      this.mostrarToast('Selecciona un archivo primero');
      return;
    }

    this.subiendo = true;
    this.progreso = 0;

    this.uploadService.uploadFile(this.archivoSeleccionado).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.subiendo = false;
          this.urlSubida = event.body?.url || event.body?.filename || 'Archivo subido';
          this.mostrarToast('¡Archivo subido exitosamente!');
        }
      },
      error: () => {
        this.subiendo = false;
        this.mostrarToast('Error al subir el archivo');
      }
    });
  }

  limpiar() {
    this.archivoSeleccionado = null;
    this.previewUrl = null;
    this.progreso = 0;
    this.urlSubida = null;
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