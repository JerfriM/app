import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DashboardPage implements OnInit {
  usuarios: User[] = [];
  totalUsuarios: number = 0;
  cargando: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatosEnParalelo();
  }

  cargarDatosEnParalelo() {
    this.cargando = true;

    forkJoin({
      usuarios: this.userService.getAll(),
    }).subscribe({
      next: (resultados) => {
        this.usuarios = resultados.usuarios;
        this.totalUsuarios = this.usuarios.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  irAUsuarios() {
    this.router.navigate(['/features/users']);
  }

  irAUpload() {
    this.router.navigate(['/features/upload']);
  }

  irANotificaciones() {
  this.router.navigate(['/features/notifications']);
}



  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
}