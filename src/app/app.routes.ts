import { Routes } from '@angular/router';
import { AuthGuard, LoggedGuard } from 'src/app/guards/AuthGuard';

export const routes: Routes = [
  {
    path: 'lists',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'lists/:listId',
    loadComponent: () => import('./pages/list-details/list-details.page').then((m) => m.ListDetailsPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage),
    canActivate: [LoggedGuard],
  },
  {
    path: '',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [LoggedGuard],
  },
  {
    path: 'account-recovery',
    loadComponent: () => import('./pages/account-recovery/account-recovery.page').then( m => m.AccountRecoveryPage),
    canActivate: [LoggedGuard],
  },


];
