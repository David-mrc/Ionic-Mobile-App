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
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full',
  },
];
