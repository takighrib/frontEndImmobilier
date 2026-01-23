import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Routes publiques
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

  // Route de connexion admin (publique)
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin-login/admin-login.component')
      .then(m => m.AdminLoginComponent),
    title: 'Connexion Admin - Agence Immobilière'
  },

  // Routes admin protégées par AuthGuard
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard],
    title: 'Dashboard Admin - Agence Immobilière'
  },
  {
    path: 'admin/biens',
    loadComponent: () => import('./pages/admin-biens/admin-biens.component')
      .then(m => m.AdminBiensComponent),
    canActivate: [AuthGuard],
    title: 'Gestion des Biens - Admin'
  },
  {
    path: 'admin/biens/nouveau',
    loadComponent: () => import('./pages/admin-bien-form/admin-bien-form.component')
      .then(m => m.AdminBienFormComponent),
    canActivate: [AuthGuard],
    title: 'Nouveau Bien - Admin'
  },
  {
    path: 'admin/biens/modifier/:id',
    loadComponent: () => import('./pages/admin-bien-form/admin-bien-form.component')
      .then(m => m.AdminBienFormComponent),
    canActivate: [AuthGuard],
    title: 'Modifier Bien - Admin'
  },
  {
    path: 'admin/contacts',
    loadComponent: () => import('./pages/admin-contact/admin-contacts.component')
      .then(m => m.AdminContactsComponent),
    canActivate: [AuthGuard],
    title: 'Demandes de Contact - Admin'
  },

  // Redirection par défaut
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];