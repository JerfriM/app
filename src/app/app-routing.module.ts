import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'features/users',
    loadComponent: () => import('./features/users/users.page').then(m => m.UsersPage),
    canActivate: [AuthGuard]
  },
  {
  path: 'features/notifications',
  loadComponent: () => import('./features/notifications/notifications.page').then(m => m.NotificationsPage),
  canActivate: [AuthGuard]
},
  // Dentro del arreglo de rutas (Routes)
{
  path: 'features/notifications',
  loadComponent: () => import('./features/notifications/notifications.page').then(m => m.NotificationsPage),
  canActivate: [AuthGuard] // Protegido en la UI
},
  {
    path: 'features/upload',
    loadComponent: () => import('./features/upload/upload.page').then(m => m.UploadPage),
    canActivate: [AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}