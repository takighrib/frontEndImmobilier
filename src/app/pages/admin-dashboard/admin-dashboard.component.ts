import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { BienService } from '../../services/bien.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  
  stats = {
    totalBiens: 0,
    biensVente: 0,
    biensLocation: 0,
    contactsNonTraites: 0
  };

  loading = true;

  constructor(
    private authService: AuthService,
    private bienService: BienService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // Charger les stats des biens
    this.bienService.getAllBiens().subscribe({
      next: (biens) => {
        this.stats.totalBiens = biens.length;
        this.stats.biensVente = biens.filter(b => b.typeTransaction === 'VENTE').length;
        this.stats.biensLocation = biens.filter(b => b.typeTransaction === 'LOCATION').length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement stats:', err);
        this.loading = false;
      }
    });
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/admin/login']);
    }
  }
}