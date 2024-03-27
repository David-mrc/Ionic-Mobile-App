import { Routes } from '@angular/router';
import { AuthGuard, LoggedGuard } from 'src/app/guards/AuthGuard';

export const routes: Routes = [
  {
    path: 'topics',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'topics/:topicId',
    loadComponent: () => import('./pages/topic-details/topic-details.page').then((m) => m.TopicDetailsPage),
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

];
