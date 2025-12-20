import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Accueil - Agence Immobilière Premium'
  },
  {
    path: 'biens',
    loadComponent: () => import('./pages/biens-list/biens-list.component').then(m => m.BiensListComponent),
    title: 'Nos Biens - Agence Immobilière Premium'
  },
  {
    path: 'bien/:id',
    // ✅ CORRECTION ICI - Importer depuis bien-detail, pas biens-list
    loadComponent: () => import('./pages/bien-detail/bien-detail.component').then(m => m.BienDetailComponent),
    title: 'Détail du Bien - Agence Immobilière Premium'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact - Agence Immobilière Premium'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'À Propos - Agence Immobilière Premium'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];