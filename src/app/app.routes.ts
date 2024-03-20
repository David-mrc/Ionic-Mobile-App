import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'topics',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'topics/:topicId',
    loadComponent: () => import('./pages/topic-details/topic-details.page').then((m) => m.TopicDetailsPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: '',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },

];
